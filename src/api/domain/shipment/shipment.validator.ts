import {body, param, query} from 'express-validator';

export default {
  ValidateGetQuote: () => [
    body('from').notEmpty().isLength({min: 2, max: 2}).withMessage('"from" must be a valid 2-letter country code'),
    body('to').notEmpty().isLength({min: 2, max: 2}).withMessage('"to" must be a valid 2-letter country code'),
    body('weight')
      .notEmpty()
      .isFloat({min: 0.001, max: 1000})
      .toFloat()
      .withMessage('"weight" be between 0.001 and 1000'),
  ],

  ValidateCreate: () => [
    body('customerId').notEmpty().isUUID(4).withMessage('"id" must be a valid UUID4'),
    body('from').notEmpty().isLength({min: 2, max: 2}).withMessage('"from" must be a valid 2-letter country code'),
    body('to').notEmpty().isLength({min: 2, max: 2}).withMessage('"to" must be a valid 2-letter country code'),
    body('weight')
      .notEmpty()
      .isFloat({min: 0.001, max: 1000})
      .toFloat()
      .withMessage('"weight" be between 0.001 and 1000'),
  ],

  ValidateGetShipments: () => [
    param('id').notEmpty().isUUID(4).withMessage('"id" must be a valid UUID4'),
    query('limit').isInt({gt: 0}),
    query('offset').isInt({min: 0}),
  ],
};
