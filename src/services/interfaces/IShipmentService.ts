import {Shipment} from '@prisma/client';
import {CountryCode, WeightKg} from '../../@types/shipment.types';

export interface ICreateShipment {
  customerId: string;
  from: CountryCode;
  to: CountryCode;
  weight: WeightKg;
}

export interface IShipmentService {
  get(customerId: string, limit: number, offset: number): Promise<Array<Shipment>>;
  create(data: ICreateShipment): Promise<Shipment>;
}
