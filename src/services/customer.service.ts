import {Customer} from '@prisma/client';
import database from '../loaders/database';

interface ICreateCustomer {
  email: string;
}

class CustomerService {
  async create(data: ICreateCustomer): Promise<Customer> {
    const email = data.email?.toLowerCase();
    if (!email) throw new Error('Invalid email provided');
    const customer = await database.customer.create({
      data: {
        email: email,
      },
    });
    return customer;
  }
}

export default new CustomerService();
