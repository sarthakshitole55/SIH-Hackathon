import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { getPrisma } from '../lib/prisma';
import { addMinutes, isBefore, isEqual, areIntervalsOverlapping } from 'date-fns';

const prisma = getPrisma();
export const sessionsRouter = Router();

const scheduleSchema = z.object({
	patientId: z.string().min(1),
	practitionerId: z.string().min(1),
	therapyId: z.string().min(1),
	startTime: z.string().datetime(),
});

sessionsRouter.get('/', async (req: Request, res: Response) => {
	const items = await prisma.session.findMany({ orderBy: { startTime: 'asc' } });
	res.json(items);
});

sessionsRouter.post('/schedule', async (req: Request, res: Response) => {
	const parsed = scheduleSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json(parsed.error.flatten());

	const { patientId, practitionerId, therapyId } = parsed.data;
	const startTime = new Date(parsed.data.startTime);
	const therapy = await prisma.therapy.findUnique({ where: { id: therapyId } });
	if (!therapy) return res.status(400).json({ error: 'Invalid therapyId' });
	const endTime = addMinutes(startTime, therapy.durationMinutes);
	if (!isBefore(startTime, endTime) && !isEqual(startTime, endTime)) {
		return res.status(400).json({ error: 'Invalid time range' });
	}

	// Check conflicts for practitioner and patient
	const [practitionerConflicts, patientConflicts] = await Promise.all([
		prisma.session.findMany({
			where: {
				practitionerId,
				startTime: { lte: endTime },
				endTime: { gte: startTime },
			},
		}),
		prisma.session.findMany({
			where: {
				patientId,
				startTime: { lte: endTime },
				endTime: { gte: startTime },
			},
		}),
	]);

	if (practitionerConflicts.length > 0) return res.status(409).json({ error: 'Practitioner has a conflict' });
	if (patientConflicts.length > 0) return res.status(409).json({ error: 'Patient has a conflict' });

	const session = await prisma.session.create({
		data: { patientId, practitionerId, therapyId, startTime, endTime },
	});

	// Stub notifications: create pre and post notifications records
	await prisma.notification.createMany({
		data: [
			{ patientId, sessionId: session.id, channel: 'IN_APP', type: 'PRE', content: 'Pre-procedure precautions', status: 'PENDING' },
			{ patientId, sessionId: session.id, channel: 'IN_APP', type: 'POST', content: 'Post-procedure care', status: 'PENDING' },
		],
	});

	res.status(201).json(session);
});

sessionsRouter.delete('/:id', async (req: Request, res: Response) => {
	try {
		await prisma.session.delete({ where: { id: req.params.id as string } });
		res.status(204).end();
	} catch (e) {
		res.status(404).json({ error: 'Not found' });
	}
});


