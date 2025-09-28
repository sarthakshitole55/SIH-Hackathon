import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { getPrisma } from '../lib/prisma';
import type { Prisma } from '../generated/prisma';

const prisma = getPrisma();
export const therapiesRouter = Router();

const therapySchema = z.object({
	name: z.string().min(1),
	description: z.string().optional(),
	durationMinutes: z.number().int().positive(),
	precautionsPre: z.string().optional(),
	precautionsPost: z.string().optional(),
});

therapiesRouter.get('/', async (req: Request, res: Response) => {
	const items = await prisma.therapy.findMany({ orderBy: { createdAt: 'desc' } });
	res.json(items);
});

therapiesRouter.get('/:id', async (req: Request, res: Response) => {
	const id = req.params.id as string;
	const item = await prisma.therapy.findUnique({ where: { id } });
	if (!item) return res.status(404).json({ error: 'Not found' });
	res.json(item);
});

therapiesRouter.post('/', async (req: Request, res: Response) => {
	const parsed = therapySchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json(parsed.error.flatten());
	const data: Prisma.TherapyCreateInput = {
		name: parsed.data.name,
		description: parsed.data.description ?? null,
		durationMinutes: parsed.data.durationMinutes,
		precautionsPre: parsed.data.precautionsPre ?? null,
		precautionsPost: parsed.data.precautionsPost ?? null,
	};
	const created = await prisma.therapy.create({ data });
	res.status(201).json(created);
});

therapiesRouter.put('/:id', async (req: Request, res: Response) => {
	const parsed = therapySchema.partial().safeParse(req.body);
	if (!parsed.success) return res.status(400).json(parsed.error.flatten());
	try {
		const id = req.params.id as string;
		const data: Prisma.TherapyUpdateInput = {};
		if (parsed.data.name !== undefined) data.name = parsed.data.name;
		if (parsed.data.description !== undefined) data.description = parsed.data.description ?? null;
		if (parsed.data.durationMinutes !== undefined) data.durationMinutes = parsed.data.durationMinutes;
		if (parsed.data.precautionsPre !== undefined) data.precautionsPre = parsed.data.precautionsPre ?? null;
		if (parsed.data.precautionsPost !== undefined) data.precautionsPost = parsed.data.precautionsPost ?? null;
		const updated = await prisma.therapy.update({ where: { id }, data });
		res.json(updated);
	} catch (e) {
		res.status(404).json({ error: 'Not found' });
	}
});

therapiesRouter.delete('/:id', async (req: Request, res: Response) => {
	try {
		const id = req.params.id as string;
		await prisma.therapy.delete({ where: { id } });
		res.status(204).end();
	} catch (e) {
		res.status(404).json({ error: 'Not found' });
	}
});


