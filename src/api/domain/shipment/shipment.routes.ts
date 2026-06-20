import {Request, Router} from 'express';
import container from '../../../loaders/container';
import {IQuotationService} from '../../../services/interfaces/IQuotationService';
import {IShipmentService} from '../../../services/interfaces/IShipmentService';
import {TYPES} from '../../../types/inversify.types';
import validate from '../../middleware/validation.middleware';
import shipmentValidator from './shipment.validator';

const ShipmentRouter = Router();
const quotationService = container.get<IQuotationService>(TYPES.QuotationService);
const shipmentService = container.get<IShipmentService>(TYPES.ShipmentService);

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
