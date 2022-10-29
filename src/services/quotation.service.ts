import {CountryCode, Price, WeightKg} from '../@types/shipment.types';
import database from '../loaders/database';

interface IGetQuoteRequest {
  from: CountryCode;
  to: CountryCode;
  weight: WeightKg;
}

interface IGetQuoteReponse {
  weightPrice: number;
  routeMuliplier: number;
  totalPrice: number;
}

class QuotationService {
  // This might be configurable in the future so it will have to go in the database
  private readonly DOMESTIC_MULTIPLIER = 1;

  public async getPriceQuote(data: IGetQuoteRequest): Promise<IGetQuoteReponse> {
    const weightPrice = await this.getWeightPrice(data.weight);
    const routeMuliplier = await this.getRouteMultiplier(data.from, data.to);
    const totalPrice = weightPrice * routeMuliplier;

    const response: IGetQuoteReponse = {
      weightPrice,
      routeMuliplier,
      totalPrice,
    };

    return response;
  }

  private async getWeightPrice(weight: WeightKg): Promise<Price> {
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
    return weightClass.price;
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
