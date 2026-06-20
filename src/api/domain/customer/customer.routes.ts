import {Router} from 'express';
import container from '../../../loaders/container';
import {ICustomerService} from '../../../services/interfaces/ICustomerService';
import {TYPES} from '../../../types/inversify.types';
import validate from '../../middleware/validation.middleware';
import customerValidator from './customer.validator';

const CustomerRouter = Router();
const customerService = container.get<ICustomerService>(TYPES.CustomerService);

CustomerRouter.get('/:id', validate(customerValidator.ValidateGet), async (req, res, next) => {
  try {
    const customer = await customerService.get(req.params['id']);
    if (!customer) return res.sendStatus(404);
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
