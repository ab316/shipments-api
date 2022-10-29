import {Request, Router} from 'express';
import quotationService from '../../../services/quotation.service';
import shipmentService from '../../../services/shipment.service';
import validate from '../../middleware/validation.middleware';
import shipmentValidator from './shipment.validator';

const ShipmentRouter = Router();

ShipmentRouter.post('/quote', validate(shipmentValidator.ValidateGetQuote), async (req, res, next) => {
  try {
    const body = req.body;
    const response = await quotationService.getPriceQuote(body);
    res.send(response);
  } catch (err) {
    next(err);
  }
});

ShipmentRouter.post('/create', validate(shipmentValidator.ValidateCreate), async (req: Request, res, next) => {
  try {
    const response = await shipmentService.create(req.body);
    res.send(response);
  } catch (err) {
    next(err);
  }
});

ShipmentRouter.get(
  '/customer/:id',
  validate(shipmentValidator.ValidateGetShipments),
  async (req: Request, res, next) => {
    try {
      const limit = Number.parseInt(req.query['limit'] as string);
      const offset = Number.parseInt(req.query['offset'] as string);
      const customerId = req.params['id'];
      res.send(await shipmentService.get(customerId, limit, offset));
    } catch (err) {
      next(err);
    }
  },
);

export default ShipmentRouter;
