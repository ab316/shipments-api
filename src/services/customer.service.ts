import {Customer, Prisma} from '@prisma/client';
import database from '../loaders/database';

interface ICreateCustomer {
  email: string;
}

class CustomerService {
  async get(id: string): Promise<Customer | null> {
    return database.customer.findUnique({
      where: {id},
    });
  }

  async create(data: ICreateCustomer): Promise<Customer> {
    const email = data.email?.toLowerCase();
    if (!email) throw new Error('Invalid email provided');

    try {
      const customer = await database.customer.create({
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

export default new CustomerService();
