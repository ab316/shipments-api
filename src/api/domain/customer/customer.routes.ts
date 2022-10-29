import {Router} from 'express';
import customerService from '../../../services/customer.service';
import validate from '../../middleware/validation.middleware';
import customerValidator from './customer.validator';

const CustomerRouter = Router();

CustomerRouter.get('/:id', validate(customerValidator.ValidateGet), async (req, res, next) => {
  try {
    const customer = await customerService.get(req.params['id']);
    if (!customer) res.sendStatus(404);
    res.send(customer);
  } catch (err) {
    next(err);
  }
});

CustomerRouter.post('/create', async (req, res, next) => {
  try {
    const customer = await customerService.create(req.body);
    res.send(customer);
  } catch (err) {
    next(err);
  }
});

export default CustomerRouter;
