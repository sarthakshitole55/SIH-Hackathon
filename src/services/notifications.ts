import { getPrisma } from '../lib/prisma';

export type SendParams = {
	patientId: string;
	sessionId?: string;
	content: string;
	type: 'PRE' | 'POST' | 'REMINDER';
	channel: 'IN_APP' | 'EMAIL' | 'SMS';
};

const prisma = getPrisma();

export async function sendNotification(params: SendParams) {
	// In-app: store as SENT; others are stubs
	if (params.channel === 'IN_APP') {
		await prisma.notification.create({
			data: {
				patientId: params.patientId,
				sessionId: params.sessionId,
				channel: 'IN_APP',
				type: params.type,
				content: params.content,
				status: 'SENT',
				sentAt: new Date(),
			},
		});
		return { ok: true };
	}
	// TODO: integrate with real providers
	await prisma.notification.create({
		data: {
			patientId: params.patientId,
			sessionId: params.sessionId,
			channel: params.channel,
			type: params.type,
			content: params.content,
			status: 'PENDING',
		},
	});
	return { ok: true };
}
