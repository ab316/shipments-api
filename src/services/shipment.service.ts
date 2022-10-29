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
