import {inject, injectable} from 'inversify';
import {Country, Prisma, Region, RegionPricing, WeightClass} from '@prisma/client';
import {IDatabase} from './interfaces/IDatabase';
import {
  IAdminService,
  ICreateCountry,
  ICreateRegion,
  ICreateRegionPricing,
  ICreateWeightClass,
  IPaginatedResponse,
  IPaginationParams,
} from './interfaces/IAdminService';
import {TYPES} from '../types/inversify.types';

@injectable()
export class AdminService implements IAdminService {
  constructor(@inject(TYPES.Database) private database: IDatabase) {}

  async createRegion(data: ICreateRegion): Promise<Region> {
    try {
      const region = await this.database.region.create({
        data: {
          name: data.name,
        },
      });
      return region;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') throw new Error('Region already exists');
      }
      throw err;
    }
  }

  async getRegion(name: string): Promise<Region | null> {
    return this.database.region.findUnique({
      where: {name},
    });
  }

  async listRegions(): Promise<Region[]> {
    return this.database.region.findMany({
      orderBy: {name: 'asc'},
    });
  }

  async createWeightClass(data: ICreateWeightClass): Promise<WeightClass> {
    const existingClasses = await this.database.weightClass.findMany({
      orderBy: {lower: 'asc'},
    });

    for (const existingClass of existingClasses) {
      const rangesOverlap =
        (data.lower >= existingClass.lower && data.lower < existingClass.upper) ||
        (data.upper > existingClass.lower && data.upper <= existingClass.upper) ||
        (data.lower <= existingClass.lower && data.upper >= existingClass.upper);

      if (rangesOverlap) {
        throw new Error('Weight class ranges must not overlap');
      }
    }

    const allClasses = [...existingClasses, data].sort((a, b) => a.lower - b.lower);

    for (let i = 1; i < allClasses.length; i++) {
      const prev = allClasses[i - 1];
      const curr = allClasses[i];

      if (prev.upper !== curr.lower) {
        throw new Error('Weight class ranges must not have gaps');
      }
    }

    try {
      const weightClass = await this.database.weightClass.create({
        data: {
          name: data.name,
          price: data.price,
          lower: data.lower,
          upper: data.upper,
          upperInclusive: data.upperInclusive ?? false,
        },
      });
      return weightClass;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') throw new Error('Weight class already exists');
      }
      throw err;
    }
  }

  async getWeightClass(name: string): Promise<WeightClass | null> {
    return this.database.weightClass.findUnique({
      where: {name},
    });
  }

  async listWeightClasses(): Promise<WeightClass[]> {
    return this.database.weightClass.findMany({
      orderBy: {lower: 'asc'},
    });
  }

  async createRegionPricing(data: ICreateRegionPricing): Promise<RegionPricing> {
    if (data.priceMultiplier <= 0) {
      throw new Error('Region pricing multiplier must be positive');
    }

    const fromRegion = await this.database.region.findUnique({
      where: {name: data.fromRegion},
    });

    if (!fromRegion) {
      throw new Error('From region does not exist');
    }

    const toRegion = await this.database.region.findUnique({
      where: {name: data.toRegion},
    });

    if (!toRegion) {
      throw new Error('To region does not exist');
    }

    try {
      const regionPricing = await this.database.regionPricing.create({
        data: {
          fromRegion: data.fromRegion,
          toRegion: data.toRegion,
          priceMultiplier: data.priceMultiplier,
        },
      });
      return regionPricing;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') throw new Error('Region pricing for this route already exists');
      }
      throw err;
    }
  }

  async getRegionPricing(id: string): Promise<RegionPricing | null> {
    return this.database.regionPricing.findUnique({
      where: {id},
    });
  }

  async listRegionPricing(): Promise<RegionPricing[]> {
    return this.database.regionPricing.findMany({
      orderBy: [{fromRegion: 'asc'}, {toRegion: 'asc'}],
    });
  }

  async listRegionPricingFrom(region: string): Promise<RegionPricing[]> {
    return this.database.regionPricing.findMany({
      where: {fromRegion: region},
      orderBy: {toRegion: 'asc'},
    });
  }

  async listRegionPricingTo(region: string): Promise<RegionPricing[]> {
    return this.database.regionPricing.findMany({
      where: {toRegion: region},
      orderBy: {fromRegion: 'asc'},
    });
  }

  async createCountry(data: ICreateCountry): Promise<Country> {
    const region = await this.database.region.findUnique({
      where: {name: data.region},
    });

    if (!region) {
      throw new Error('Region does not exist');
    }

    try {
      const country = await this.database.country.create({
        data: {
          isoCode: data.isoCode.toUpperCase(),
          region: data.region,
        },
      });
      return country;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') throw new Error('Country already exists');
      }
      throw err;
    }
  }

  async getCountry(isoCode: string): Promise<Country | null> {
    return this.database.country.findUnique({
      where: {isoCode: isoCode.toUpperCase()},
    });
  }

  async listCountries(pagination: IPaginationParams): Promise<IPaginatedResponse<Country>> {
    const [total, items] = await Promise.all([
      this.database.country.count(),
      this.database.country.findMany({
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: {isoCode: 'asc'},
      }),
    ]);

    return {
      meta: {
        total,
        limit: pagination.limit,
        offset: pagination.offset,
      },
      items,
    };
  }

  async listCountriesByRegion(region: string): Promise<Country[]> {
    return this.database.country.findMany({
      where: {region},
      orderBy: {isoCode: 'asc'},
    });
  }
}
