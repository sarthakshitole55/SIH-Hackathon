import { PrismaClient } from '../generated/prisma';

let globalPrisma: PrismaClient | undefined;

export function getPrisma(): PrismaClient {
	if (!globalPrisma) {
		globalPrisma = new PrismaClient();
	}
	return globalPrisma;
}


