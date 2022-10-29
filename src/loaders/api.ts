import express from 'express';
import bodyParser from 'body-parser';
import CustomerRouter from '../api/routes/customer.routes';
import ShipmentRouter from '../api/routes/shipment.routes';

export default function loadAPI(app: express.Application) {
  app.use(bodyParser.json());

  app.use('/customer', CustomerRouter);
  app.use('/shipment', ShipmentRouter);

  app.use(errorHandler);
}

const errorHandler = async (err, req, res, next) => {
  console.log('error', err);
  res.status(500).send('An error occurred');
};
