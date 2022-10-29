import {Router} from 'express';
import customerService from '../../services/customer.service';

const CustomerRouter = Router();

CustomerRouter.post('/create', async (req, res, next) => {
  try {
    const customer = await customerService.create(req.body);
    res.send(customer);
  } catch (err) {
    next(err);
  }
});

export default CustomerRouter;
