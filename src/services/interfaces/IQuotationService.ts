import {CountryCode, WeightKg} from '../../@types/shipment.types';

export interface IGetQuoteRequest {
  from: CountryCode;
  to: CountryCode;
  weight: WeightKg;
}

export interface IGetQuoteResponse {
  weightClass: string;
  weightPrice: number;
  routeMuliplier: number;
  totalPrice: number;
}

export interface IQuotationService {
  getPriceQuote(data: IGetQuoteRequest): Promise<IGetQuoteResponse>;
}
