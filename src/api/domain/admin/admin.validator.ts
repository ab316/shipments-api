import {body, param, query} from 'express-validator';

export default {
  ValidateCreateRegion: () => [body('name').notEmpty().isString().withMessage('"name" is required')],

  ValidateGetRegion: () => [param('name').notEmpty().isString().withMessage('"name" must be a non-empty string')],

  ValidateCreateWeightClass: () => [
    body('name').notEmpty().isString().withMessage('"name" is required'),
    body('price').notEmpty().isInt({min: 0}).toInt().withMessage('"price" must be a non-negative integer'),
    body('lower').notEmpty().isFloat({min: 0}).toFloat().withMessage('"lower" must be a non-negative number'),
    body('upper')
      .notEmpty()
      .isFloat({min: 0})
      .toFloat()
      .withMessage('"upper" must be a non-negative number')
      .custom((value, {req}) => {
        if (value <= req.body.lower) {
          throw new Error('"upper" must be greater than "lower"');
        }
        return true;
      }),
    body('upperInclusive').optional().isBoolean().toBoolean().withMessage('"upperInclusive" must be a boolean'),
  ],

  ValidateGetWeightClass: () => [param('name').notEmpty().isString().withMessage('"name" must be a non-empty string')],

  ValidateCreateRegionPricing: () => [
    body('fromRegion').notEmpty().isString().withMessage('"fromRegion" is required'),
    body('toRegion').notEmpty().isString().withMessage('"toRegion" is required'),
    body('priceMultiplier')
      .notEmpty()
      .isFloat({min: 0.001})
      .toFloat()
      .withMessage('"priceMultiplier" must be a positive number'),
  ],

  ValidateGetRegionPricing: () => [param('id').notEmpty().isUUID(4).withMessage('"id" must be a valid UUID4')],

  ValidateGetRegionPricingByRegion: () => [
    param('region').notEmpty().isString().withMessage('"region" must be a non-empty string'),
  ],

  ValidateCreateCountry: () => [
    body('isoCode')
      .notEmpty()
      .isString()
      .isLength({min: 2, max: 2})
      .withMessage('"isoCode" must be a 2-character string'),
    body('region').notEmpty().isString().withMessage('"region" is required'),
  ],

  ValidateGetCountry: () => [
    param('isoCode')
      .notEmpty()
      .isString()
      .isLength({min: 2, max: 2})
      .withMessage('"isoCode" must be a 2-character string'),
  ],

  ValidateListCountries: () => [
    query('limit')
      .optional()
      .isInt({min: 1, max: 100})
      .toInt()
      .withMessage('"limit" must be an integer between 1 and 100'),
    query('offset').optional().isInt({min: 0}).toInt().withMessage('"offset" must be a non-negative integer'),
  ],

  ValidateGetCountriesByRegion: () => [
    param('region').notEmpty().isString().withMessage('"region" must be a non-empty string'),
  ],
};
