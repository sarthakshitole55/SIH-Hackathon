import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { getPrisma } from '../lib/prisma';
import type { Prisma } from '../generated/prisma';

const prisma = getPrisma();
export const practitionersRouter = Router();

const practitionerSchema = z.object({
	fullName: z.string().min(1),
	specialty: z.string().optional(),
	phone: z.string().optional(),
	email: z.string().email().optional(),
});

practitionersRouter.get('/', async (req: Request, res: Response) => {
	const items = await prisma.practitioner.findMany({ orderBy: { createdAt: 'desc' } });
	res.json(items);
});

practitionersRouter.get('/:id', async (req: Request, res: Response) => {
	const id = req.params.id as string;
	const item = await prisma.practitioner.findUnique({ where: { id } });
	if (!item) return res.status(404).json({ error: 'Not found' });
	res.json(item);
});

practitionersRouter.post('/', async (req: Request, res: Response) => {
	const parsed = practitionerSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json(parsed.error.flatten());
	const data: Prisma.PractitionerCreateInput = {
		fullName: parsed.data.fullName,
		specialty: parsed.data.specialty ?? null,
		phone: parsed.data.phone ?? null,
		email: parsed.data.email ?? null,
	};
	const created = await prisma.practitioner.create({ data });
	res.status(201).json(created);
});

practitionersRouter.put('/:id', async (req: Request, res: Response) => {
	const parsed = practitionerSchema.partial().safeParse(req.body);
	if (!parsed.success) return res.status(400).json(parsed.error.flatten());
	try {
		const id = req.params.id as string;
		const data: Prisma.PractitionerUpdateInput = {};
		if (parsed.data.fullName !== undefined) data.fullName = parsed.data.fullName;
		if (parsed.data.specialty !== undefined) data.specialty = parsed.data.specialty ?? null;
		if (parsed.data.phone !== undefined) data.phone = parsed.data.phone ?? null;
		if (parsed.data.email !== undefined) data.email = parsed.data.email ?? null;
		const updated = await prisma.practitioner.update({ where: { id }, data });
		res.json(updated);
	} catch (e) {
		res.status(404).json({ error: 'Not found' });
	}
});

practitionersRouter.delete('/:id', async (req: Request, res: Response) => {
	try {
		const id = req.params.id as string;
		await prisma.practitioner.delete({ where: { id } });
		res.status(204).end();
	} catch (e) {
		res.status(404).json({ error: 'Not found' });
	}
});


