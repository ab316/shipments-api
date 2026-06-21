import {Router} from 'express';
import container from '../../../loaders/container';
import {IAdminService} from '../../../services/interfaces/IAdminService';
import {TYPES} from '../../../types/inversify.types';
import validate from '../../middleware/validation.middleware';
import adminValidator from './admin.validator';

const AdminRouter = Router();
const adminService = container.get<IAdminService>(TYPES.AdminService);

const RegionRouter = Router();

RegionRouter.post('/', validate(adminValidator.ValidateCreateRegion), async (req, res, next) => {
  try {
    const region = await adminService.createRegion(req.body);
    res.send(region);
  } catch (err) {
    next(err);
  }
});

RegionRouter.get('/', async (req, res, next) => {
  try {
    const regions = await adminService.listRegions();
    res.send(regions);
  } catch (err) {
    next(err);
  }
});

RegionRouter.get('/by-name/:name', validate(adminValidator.ValidateGetRegion), async (req, res, next) => {
  try {
    const region = await adminService.getRegion(req.params['name']);
    if (!region) return res.sendStatus(404);
    res.send(region);
  } catch (err) {
    next(err);
  }
});

const WeightClassRouter = Router();

WeightClassRouter.post('/', validate(adminValidator.ValidateCreateWeightClass), async (req, res, next) => {
  try {
    const weightClass = await adminService.createWeightClass(req.body);
    res.send(weightClass);
  } catch (err) {
    next(err);
  }
});

WeightClassRouter.get('/', async (req, res, next) => {
  try {
    const weightClasses = await adminService.listWeightClasses();
    res.send(weightClasses);
  } catch (err) {
    next(err);
  }
});

WeightClassRouter.get('/by-name/:name', validate(adminValidator.ValidateGetWeightClass), async (req, res, next) => {
  try {
    const weightClass = await adminService.getWeightClass(req.params['name']);
    if (!weightClass) return res.sendStatus(404);
    res.send(weightClass);
  } catch (err) {
    next(err);
  }
});

const RegionPricingRouter = Router();

RegionPricingRouter.post('/', validate(adminValidator.ValidateCreateRegionPricing), async (req, res, next) => {
  try {
    const regionPricing = await adminService.createRegionPricing(req.body);
    res.send(regionPricing);
  } catch (err) {
    next(err);
  }
});

RegionPricingRouter.get('/', async (req, res, next) => {
  try {
    const regionPricing = await adminService.listRegionPricing();
    res.send(regionPricing);
  } catch (err) {
    next(err);
  }
});

RegionPricingRouter.get('/:id', validate(adminValidator.ValidateGetRegionPricing), async (req, res, next) => {
  try {
    const regionPricing = await adminService.getRegionPricing(req.params['id']);
    if (!regionPricing) return res.sendStatus(404);
    res.send(regionPricing);
  } catch (err) {
    next(err);
  }
});

RegionPricingRouter.get(
  '/from/:region',
  validate(adminValidator.ValidateGetRegionPricingByRegion),
  async (req, res, next) => {
    try {
      const regionPricing = await adminService.listRegionPricingFrom(req.params['region']);
      res.send(regionPricing);
    } catch (err) {
      next(err);
    }
  },
);

RegionPricingRouter.get(
  '/to/:region',
  validate(adminValidator.ValidateGetRegionPricingByRegion),
  async (req, res, next) => {
    try {
      const regionPricing = await adminService.listRegionPricingTo(req.params['region']);
      res.send(regionPricing);
    } catch (err) {
      next(err);
    }
  },
);

const CountryRouter = Router();

CountryRouter.post('/', validate(adminValidator.ValidateCreateCountry), async (req, res, next) => {
  try {
    const country = await adminService.createCountry(req.body);
    res.send(country);
  } catch (err) {
    next(err);
  }
});

CountryRouter.get('/', validate(adminValidator.ValidateListCountries), async (req, res, next) => {
  try {
    const limit = req.query['limit'] ? parseInt(req.query['limit'] as string) : 10;
    const offset = req.query['offset'] ? parseInt(req.query['offset'] as string) : 0;
    const countries = await adminService.listCountries({limit, offset});
    res.send(countries);
  } catch (err) {
    next(err);
  }
});

CountryRouter.get('/by-iso-code/:isoCode', validate(adminValidator.ValidateGetCountry), async (req, res, next) => {
  try {
    const country = await adminService.getCountry(req.params['isoCode']);
    if (!country) return res.sendStatus(404);
    res.send(country);
  } catch (err) {
    next(err);
  }
});

CountryRouter.get(
  '/by-region/:region',
  validate(adminValidator.ValidateGetCountriesByRegion),
  async (req, res, next) => {
    try {
      const countries = await adminService.listCountriesByRegion(req.params['region']);
      res.send(countries);
    } catch (err) {
      next(err);
    }
  },
);

AdminRouter.use('/region', RegionRouter);
AdminRouter.use('/weightclass', WeightClassRouter);
AdminRouter.use('/region-pricing', RegionPricingRouter);
AdminRouter.use('/country', CountryRouter);

export default AdminRouter;
