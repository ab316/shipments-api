import {Container} from 'inversify';
import {TYPES} from '../types/inversify.types';
import {IDatabase} from '../services/interfaces/IDatabase';
import {ICustomerService} from '../services/interfaces/ICustomerService';
import {IQuotationService} from '../services/interfaces/IQuotationService';
import {IShipmentService} from '../services/interfaces/IShipmentService';
import {createDatabase} from './database';
import {CustomerService} from '../services/customer.service';
import {QuotationService} from '../services/quotation.service';
import {ShipmentService} from '../services/shipment.service';

const container = new Container();

container
  .bind<IDatabase>(TYPES.Database)
  .toDynamicValue(() => createDatabase())
  .inSingletonScope();
container.bind<ICustomerService>(TYPES.CustomerService).to(CustomerService).inSingletonScope();
container.bind<IQuotationService>(TYPES.QuotationService).to(QuotationService).inSingletonScope();
container.bind<IShipmentService>(TYPES.ShipmentService).to(ShipmentService).inSingletonScope();

export default container;
