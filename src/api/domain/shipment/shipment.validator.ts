import {body} from 'express-validator';

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
};
