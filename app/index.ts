import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';

import { config } from 'dotenv';

config();

const app: Express = express();
app.use(cors());

const accessToken: string = process.env.GH_ACCESS_TOKEN || '';
const username: string = process.env.GH_ACCESS_USERNAME || '';

app.get('/github', async (req: Request, res: Response) => {

  if ( !accessToken || !username ) {
    return res.status(400).send({ error: 'something went wrong.' });
  }

  const userData = await axios.get('https://api.github.com/user', {
    auth: {
      username: username,
      password: accessToken,
    }
  });

  return res.status(200).send({
    login: userData.data.login,
    avatar_url: userData.data.avatar_url,
  });
});

app.listen(4000, () => {
  console.log('listening.....');
});
