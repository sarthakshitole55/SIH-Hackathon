import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { getPrisma } from '../lib/prisma';
import type { Prisma } from '../generated/prisma';

const prisma = getPrisma();
export const patientsRouter = Router();

const patientSchema = z.object({
	fullName: z.string().min(1),
	dateOfBirth: z.string().datetime().optional(),
	gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
	phone: z.string().optional(),
	email: z.string().email().optional(),
	notes: z.string().optional(),
});

patientsRouter.get('/', async (req: Request, res: Response) => {
	const patients = await prisma.patient.findMany({ orderBy: { createdAt: 'desc' } });
	res.json(patients);
});


patientsRouter.get('/:id', async (req: Request, res: Response) => {
	const id = req.params.id as string;
	const patient = await prisma.patient.findUnique({ where: { id } });
	if (!patient) return res.status(404).json({ error: 'Not found' });
	res.json(patient);
});

patientsRouter.post('/', async (req: Request, res: Response) => {
	const parsed = patientSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json(parsed.error.flatten());

	const data: Prisma.PatientCreateInput = {
		fullName: parsed.data.fullName,
		dateOfBirth: parsed.data.dateOfBirth ? new Date(parsed.data.dateOfBirth) : null,
		gender: parsed.data.gender ?? null,
		phone: parsed.data.phone ?? null,
		email: parsed.data.email ?? null,
		notes: parsed.data.notes ?? null,
	};

	const patient = await prisma.patient.create({ data });
	res.status(201).json(patient);
});

patientsRouter.put('/:id', async (req: Request, res: Response) => {
	const parsed = patientSchema.partial().safeParse(req.body);
	if (!parsed.success) return res.status(400).json(parsed.error.flatten());
	try {
		const id = req.params.id as string;
		const data: Prisma.PatientUpdateInput = {};
		if (parsed.data.fullName !== undefined) data.fullName = parsed.data.fullName;
		if (parsed.data.dateOfBirth !== undefined) data.dateOfBirth = parsed.data.dateOfBirth ? new Date(parsed.data.dateOfBirth) : null;
		if (parsed.data.gender !== undefined) data.gender = parsed.data.gender ?? null;
		if (parsed.data.phone !== undefined) data.phone = parsed.data.phone ?? null;
		if (parsed.data.email !== undefined) data.email = parsed.data.email ?? null;
		if (parsed.data.notes !== undefined) data.notes = parsed.data.notes ?? null;

		const updated = await prisma.patient.update({ where: { id }, data });
		res.json(updated);
	} catch (e) {
		res.status(404).json({ error: 'Not found' });
	}
});

patientsRouter.delete('/:id', async (req: Request, res: Response) => {
	try {
		const id = req.params.id as string;
		await prisma.patient.delete({ where: { id } });
		res.status(204).end();
	} catch (e) {
		res.status(404).json({ error: 'Not found' });
	}
});


