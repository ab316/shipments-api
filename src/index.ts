import express from 'express';
import 'dotenv/config';
import './loaders/database';
import loadAPI from './loaders/api';

const DEFAULT_PORT = 3000;
const PORT = process.env['PORT'] ?? DEFAULT_PORT;

const app = express();
loadAPI(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
