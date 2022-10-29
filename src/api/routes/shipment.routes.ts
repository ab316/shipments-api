import {Router} from 'express';
import quotationService from '../../services/quotation.service';
import validate from '../middleware/validation.middleware';
import ShipmentValidator from '../validators/shipment.validator';

const ShipmentRouter = Router();

ShipmentRouter.post('/quote', validate(ShipmentValidator.ValidateGetQuote), async (req, res, next) => {
  try {
    const body = req.body;
    const response = await quotationService.getPriceQuote(body);
    res.send(response);
  } catch (err) {
    next(err);
  }
});

export default ShipmentRouter;
