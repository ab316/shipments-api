import {Country, Region, RegionPricing, WeightClass} from '@prisma/client';

export interface ICreateRegion {
  name: string;
}

export interface ICreateWeightClass {
  name: string;
  price: number;
  lower: number;
  upper: number;
  upperInclusive?: boolean;
}

export interface ICreateRegionPricing {
  fromRegion: string;
  toRegion: string;
  priceMultiplier: number;
}

export interface ICreateCountry {
  isoCode: string;
  region: string;
}

export interface IPaginationParams {
  limit: number;
  offset: number;
}

export interface IPaginatedResponse<T> {
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
  items: T[];
}

export interface IAdminService {
  createRegion(data: ICreateRegion): Promise<Region>;
  getRegion(name: string): Promise<Region | null>;
  listRegions(): Promise<Region[]>;

  createWeightClass(data: ICreateWeightClass): Promise<WeightClass>;
  getWeightClass(name: string): Promise<WeightClass | null>;
  listWeightClasses(): Promise<WeightClass[]>;

  createRegionPricing(data: ICreateRegionPricing): Promise<RegionPricing>;
  getRegionPricing(id: string): Promise<RegionPricing | null>;
  listRegionPricing(): Promise<RegionPricing[]>;
  listRegionPricingFrom(region: string): Promise<RegionPricing[]>;
  listRegionPricingTo(region: string): Promise<RegionPricing[]>;

  createCountry(data: ICreateCountry): Promise<Country>;
  getCountry(isoCode: string): Promise<Country | null>;
  listCountries(pagination: IPaginationParams): Promise<IPaginatedResponse<Country>>;
  listCountriesByRegion(region: string): Promise<Country[]>;
}
