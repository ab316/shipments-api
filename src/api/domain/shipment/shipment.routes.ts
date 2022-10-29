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

ShipmentRouter.get('/customer/:id', validate(shipmentValidator.ValidateGetShipments), async (req, res, next) => {
  console.log('query', req.query);
  res.sendStatus(200);
});

export default ShipmentRouter;
