import {inject, injectable} from 'inversify';
import {Customer, Prisma} from '@prisma/client';
import {IDatabase} from './interfaces/IDatabase';
import {ICustomerService, ICreateCustomer} from './interfaces/ICustomerService';
import {TYPES} from '../types/inversify.types';

@injectable()
export class CustomerService implements ICustomerService {
  constructor(@inject(TYPES.Database) private database: IDatabase) {}

  async get(id: string): Promise<Customer | null> {
    return this.database.customer.findUnique({
      where: {id},
    });
  }

  async create(data: ICreateCustomer): Promise<Customer> {
    const email = data.email?.toLowerCase();
    if (!email) throw new Error('Invalid email provided');

    try {
      const customer = await this.database.customer.create({
        data: {
          email: email,
        },
      });
      return customer;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') throw new Error('User already exists');
      }
      throw err;
    }
  }
}
