import {Prisma, PrismaClient, Region} from '@prisma/client';
import {ALL_COUNTRIES, EU_COUNTRIES} from './countries';

const prisma = new PrismaClient();

enum REGION_NAME {
  EU = 'EU',
  REST_OF_WORLD = 'Rest of World',
}
const REGIONS = [REGION_NAME.EU, REGION_NAME.REST_OF_WORLD];

const WEIGHT_CLASSES: Array<Prisma.WeightClassCreateInput> = [
  {name: 'Small', lower: 0, upper: 10, price: 100},
  {name: 'Medium', lower: 10, upper: 25, price: 300},
  {name: 'Large', lower: 25, upper: 50, price: 500},
  {name: 'Huge', lower: 50, upper: 1000, price: 2000, upperInclusive: true},
];

const REGION_PRICINGS: Array<Prisma.RegionPricingUncheckedCreateInput> = [
  {fromRegion: REGION_NAME.EU, toRegion: REGION_NAME.EU, priceMultiplier: 1.5},
  {fromRegion: REGION_NAME.REST_OF_WORLD, toRegion: REGION_NAME.EU, priceMultiplier: 2.5},
  {fromRegion: REGION_NAME.EU, toRegion: REGION_NAME.REST_OF_WORLD, priceMultiplier: 2.5},
];

async function main() {
  await Promise.all(
    REGIONS.map(async (region) =>
      prisma.region.upsert({
        where: {name: region},
        create: {name: region},
        update: {},
      }),
    ),
  );

  await Promise.all(
    EU_COUNTRIES.map(async ({Code}) =>
      prisma.country.upsert({
        where: {isoCode: Code},
        update: {},
        create: {
          isoCode: Code,
          region: REGION_NAME.EU,
        },
      }),
    ),
  );

  const euCountryCodes = EU_COUNTRIES.map((c) => c.Code);
  await Promise.all(
    ALL_COUNTRIES.filter((country) => !euCountryCodes.includes(country.Code)).map(async ({Code}) =>
      prisma.country.upsert({
        where: {isoCode: Code},
        update: {},
        create: {
          isoCode: Code,
          region: REGION_NAME.REST_OF_WORLD,
        },
      }),
    ),
  );

  await Promise.all(
    WEIGHT_CLASSES.map((weight) =>
      prisma.weightClass.upsert({
        where: {name: weight.name},
        update: weight,
        create: weight,
      }),
    ),
  );

  await Promise.all(
    REGION_PRICINGS.map((pricing) =>
      prisma.regionPricing.upsert({
        where: {fromRegion_toRegion: {fromRegion: pricing.fromRegion, toRegion: pricing.toRegion}},
        update: pricing,
        create: pricing,
      }),
    ),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
