import { Request, Response, Router } from 'express';
import axios from 'axios';

import { env } from '../../config/environments';

const github: Router = Router();

github.get('/', async (req: Request, res: Response) => {

  if ( !env.github.username || !env.github.access_key ) {
    return res.status(400).send({ error: 'something went wrong.' });
  }

  const userData = await axios.get('https://api.github.com/user', {
    auth: {
      username: env.github.username,
      password: env.github.access_key,
    }
  });

  return res.status(200).send({
    login: userData.data.login,
    avatar_url: userData.data.avatar_url,
  });
});


export { github };
