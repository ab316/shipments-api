import {inject, injectable} from 'inversify';
import {WeightClass} from '@prisma/client';
import {CountryCode, WeightKg} from '../@types/shipment.types';
import {IDatabase} from './interfaces/IDatabase';
import {IQuotationService, IGetQuoteRequest, IGetQuoteResponse} from './interfaces/IQuotationService';
import {TYPES} from '../types/inversify.types';

@injectable()
export class QuotationService implements IQuotationService {
  private readonly DOMESTIC_MULTIPLIER = 1;

  constructor(@inject(TYPES.Database) private database: IDatabase) {}

  public async getPriceQuote(data: IGetQuoteRequest): Promise<IGetQuoteResponse> {
    const weightClass = await this.getWeightClass(data.weight);
    const routeMuliplier = await this.getRouteMultiplier(data.from, data.to);
    const totalPrice = weightClass.price * routeMuliplier;

    const response: IGetQuoteResponse = {
      weightClass: weightClass.name,
      weightPrice: weightClass.price,
      routeMuliplier,
      totalPrice,
    };

    return response;
  }

  private async getWeightClass(weight: WeightKg): Promise<WeightClass> {
    const weightClass = await this.database.weightClass.findFirstOrThrow({
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
    const fromCountry = await this.database.country.findFirstOrThrow({
      where: {isoCode: from},
    });

    const toCountry = await this.database.country.findFirstOrThrow({
      where: {isoCode: to},
    });

    if (toCountry.region === fromCountry.region) return this.DOMESTIC_MULTIPLIER;

    const regionPricing = await this.database.regionPricing.findFirstOrThrow({
      where: {fromRegion: fromCountry.region, toRegion: toCountry.region},
    });

    return regionPricing.priceMultiplier;
  }
}
