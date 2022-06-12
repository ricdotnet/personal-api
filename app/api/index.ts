import { Router } from 'express';
import { github } from './github';
import { spotify } from './spotify';

const api: Router = Router();
api.use('/github', github);
api.use('/spotify', spotify);

export { api };
