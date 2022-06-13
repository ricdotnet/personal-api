import express, { Express } from 'express';
import cors from 'cors';
import { api } from './api';
import { Env } from './util/env';

const app: Express = express();
new Env();

app.use(cors());
app.use('/v1', api);

app.listen(4000, () => {
  console.log('Server listening on port: 4000');
});
