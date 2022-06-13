import { Request, Response, Router } from 'express';
import axios from 'axios';
import { Env } from '../../util/env';

const github: Router = Router();

github.get('/', async (req: Request, res: Response) => {

  if ( !Env.get('GH_ACCESS_USERNAME') || !Env.get('GH_ACCESS_TOKEN') ) {
    return res.status(400).send({ error: 'something went wrong' });
  }

  const userData = await axios.get('https://api.github.com/user', {
    auth: {
      username: Env.get('GH_ACCESS_USERNAME')!,
      password: Env.get('GH_ACCESS_TOKEN')!,
    }
  });

  return res.status(200).send({
    login: userData.data.login,
    avatar_url: userData.data.avatar_url,
  });
});


export { github };
