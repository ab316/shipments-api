import {param} from 'express-validator';

export default {
  ValidateGet: () => [param('id').notEmpty().isUUID(4).withMessage('"id" must be a valid UUID4')],
};
