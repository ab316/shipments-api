import {inject, injectable} from 'inversify';
import {Shipment} from '@prisma/client';
import {IDatabase} from './interfaces/IDatabase';
import {IShipmentService, ICreateShipment} from './interfaces/IShipmentService';
import {IQuotationService} from './interfaces/IQuotationService';
import {TYPES} from '../types/inversify.types';

@injectable()
export class ShipmentService implements IShipmentService {
  constructor(
    @inject(TYPES.Database) private database: IDatabase,
    @inject(TYPES.QuotationService) private quotationService: IQuotationService,
  ) {}

  public async get(customerId: string, limit: number, offset: number): Promise<Array<Shipment>> {
    return this.database.shipment.findMany({
      where: {customerId},
      take: limit,
      skip: offset,
      orderBy: {createdAt: 'desc'},
    });
  }

  public async create(data: ICreateShipment): Promise<Shipment> {
    const fromCountry = await this.database.country.findFirstOrThrow({where: {isoCode: data.from}});

    const toCountry = await this.database.country.findFirstOrThrow({where: {isoCode: data.to}});

    const quote = await this.quotationService.getPriceQuote({
      from: data.from,
      to: data.to,
      weight: data.weight,
    });

    const shipment = await this.database.shipment.create({
      data: {
        customerId: data.customerId,
        weight: data.weight,
        fromCountry: data.from,
        toCountry: data.to,
        price: quote.totalPrice,
        weightClass: quote.weightClass,
        fromRegion: fromCountry.region,
        toRegion: toCountry.region,
      },
    });

    return shipment;
  }
}
