import {Customer} from '@prisma/client';

export interface ICreateCustomer {
  email: string;
}

export interface ICustomerService {
  get(id: string): Promise<Customer | null>;
  create(data: ICreateCustomer): Promise<Customer>;
}
