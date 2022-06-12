import { Request, Response, Router } from 'express';
import axios from 'axios';
import { env } from '../../config/environments';

const spotify: Router = Router();

let accessToken: any = 'dummy_token'; // don't leave empty. I do not want to deal with multiple errors...

// TODO: refactor this into some separated services for that ugly logic
spotify.get('/', async (req: Request, res: Response) => {

  let currentlyPlaying;

  try {
    currentlyPlaying = await getCurrentlyPlaying();
  } catch (e: any) {
    // when some user visits and if the request gets a 401 we then runs a request to get a refreshed token to request the song again
    if ( e.response.data.error.status === 401 ) {
      const refreshedToken = await refreshAccessToken();
      accessToken = refreshedToken.data.access_token;

      currentlyPlaying = await getCurrentlyPlaying();
      return res.send(currentlyPlaying.data);
    }
    return res.status(400).send({ error: 'something went wrong.' });
  }

  res.send(currentlyPlaying.data);
});

async function getCurrentlyPlaying() {
  return await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${accessToken}`,
    }
  });
}

async function refreshAccessToken() {
  return await axios.post('https://accounts.spotify.com/api/token',
    `grant_type=refresh_token&refresh_token=${env.spotify.refresh_token}`, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(env.spotify.client_id + ':' + env.spotify.client_secret).toString('base64'),
      }
    });
}

export { spotify };
