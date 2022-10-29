import {WeightClass} from '@prisma/client';
import {CountryCode, WeightKg} from '../@types/shipment.types';
import database from '../loaders/database';

interface IGetQuoteRequest {
  from: CountryCode;
  to: CountryCode;
  weight: WeightKg;
}

interface IGetQuoteReponse {
  weightClass: string;
  weightPrice: number;
  routeMuliplier: number;
  totalPrice: number;
}

class QuotationService {
  // This might be configurable in the future so it will have to go in the database
  private readonly DOMESTIC_MULTIPLIER = 1;

  public async getPriceQuote(data: IGetQuoteRequest): Promise<IGetQuoteReponse> {
    const weightClass = await this.getWeightClass(data.weight);
    const routeMuliplier = await this.getRouteMultiplier(data.from, data.to);
    const totalPrice = weightClass.price * routeMuliplier;

    const response: IGetQuoteReponse = {
      weightClass: weightClass.name,
      weightPrice: weightClass.price,
      routeMuliplier,
      totalPrice,
    };

    return response;
  }

  private async getWeightClass(weight: WeightKg): Promise<WeightClass> {
    const weightClass = await database.weightClass.findFirstOrThrow({
      where: {
        AND: [
          {lower: {lte: weight}},
          {
            OR: [
              {upper: {gt: weight}, upperInclusive: false},
              {upper: {gte: weight}, upperInclusive: true},
            ],
          },
        ],
      },
    });
    return weightClass;
  }

  private async getRouteMultiplier(from: CountryCode, to: CountryCode): Promise<number> {
    const fromCountry = await database.country.findFirstOrThrow({
      where: {isoCode: from},
    });

    const toCountry = await database.country.findFirstOrThrow({
      where: {isoCode: to},
    });

    if (toCountry.region === fromCountry.region) return this.DOMESTIC_MULTIPLIER;

    const regionPricing = await database.regionPricing.findFirstOrThrow({
      where: {fromRegion: fromCountry.region, toRegion: toCountry.region},
    });

    return regionPricing.priceMultiplier;
  }
}

export default new QuotationService();
