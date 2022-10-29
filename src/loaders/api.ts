import express from 'express';
import bodyParser from 'body-parser';
import CustomerRouter from '../api/domain/customer/customer.routes';
import ShipmentRouter from '../api/domain/shipment/shipment.routes';

export default function loadAPI(app: express.Application) {
  app.use(bodyParser.json());

  app.use('/customer', CustomerRouter);
  app.use('/shipment', ShipmentRouter);

  app.use(errorHandler);
}

// TODO: Add proper error-handling (With custom error classes perhaps)
const errorHandler = async (err, req, res, next) => {
  console.error('error', err);
  res.status(500).send(err.message ?? err);
};
