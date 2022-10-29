import {Shipment} from '@prisma/client';
import {CountryCode, WeightKg} from '../@types/shipment.types';
import database from '../loaders/database';
import quotationService from './quotation.service';

interface ICreateShipment {
  customerId: string;
  from: CountryCode;
  to: CountryCode;
  weight: WeightKg;
}

class ShipmentService {
  // Better to use cursor-based pagination for maximum scalability
  public async get(customerId: string, limit: number, offset: number): Promise<Array<Shipment>> {
    return database.shipment.findMany({
      where: {customerId},
      take: limit,
      skip: offset,
      orderBy: {createdAt: 'desc'},
    });
  }

  public async create(data: ICreateShipment) {
    const fromCountry = await database.country.findFirstOrThrow({where: {isoCode: data.from}});

    const toCountry = await database.country.findFirstOrThrow({where: {isoCode: data.to}});

    const quote = await quotationService.getPriceQuote({
      from: data.from,
      to: data.to,
      weight: data.weight,
    });

    const shipment = await database.shipment.create({
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

export default new ShipmentService();
