import express, { Express } from 'express';
import cors from 'cors';
import { api } from './api';

const app: Express = express();
app.use(cors());
app.use('/v1', api);

app.listen(4000, () => {
  console.log('listening.....');
});
