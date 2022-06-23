import http, { Server } from 'http';
import express, { Express } from 'express';
import cors from 'cors';
import { api } from './api';
import { Env } from './util/env';
import { initWebsocketServer } from './websocket';

const app: Express = express();
const server: Server = http.createServer(app);
new Env();

initWebsocketServer(server);

app.use(cors());
app.use('/v1', api);

server.listen(4000, () => {
  console.log('Server listening on port: 4000');
});
