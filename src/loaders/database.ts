import {PrismaClient} from '@prisma/client';
import {IDatabase} from '../services/interfaces/IDatabase';

export const createDatabase = (): IDatabase => {
  return new PrismaClient() as IDatabase;
};
