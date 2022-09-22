import { Request, Response, Router } from 'express';
import { Env } from '../../util/env';
import axios from 'axios';
import WebSocket from 'ws';

import { connections } from '../../websocket';

const spotify: Router = Router();

let accessToken: any = 'dummy_token'; // don't leave empty. I do not want to deal with multiple errors...
let dealerSpotify: any = null;
let connection_id: any = null;

// TODO: refactor this into some separated services for that ugly logic
spotify.get('/', async (req: Request, res: Response) => {
  let currentlyPlaying;

  try {
    currentlyPlaying = await getCurrentlyPlaying();
  } catch (e: any) {
    // when some user visits and if the request gets a 401 we then runs a request to get a refreshed token to request the song again
    if (e.response.data.error.status === 401) {
      const refreshedToken = await refreshAccessToken();
      accessToken = refreshedToken.data.access_token;

      currentlyPlaying = await getCurrentlyPlaying();
      await requestSpotifyTokenFromDiscord();
      connectToSpotifyDealer();
      return res.send(currentlyPlaying.data);
    }
    return res.status(400).send({ error: 'something went wrong.' });
  }

  // connectToSpotifyDealer();
  await requestSpotifyTokenFromDiscord();
  connectToSpotifyDealer();
  res.send(currentlyPlaying.data);
});

async function getCurrentlyPlaying() {
  return await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${accessToken}`,
    },
  });
}

async function refreshAccessToken() {
  return await axios.post(
    'https://accounts.spotify.com/api/token',
    `grant_type=refresh_token&refresh_token=${Env.get('SPOTIFY_REFRESH_TOKEN')}`,
    {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(Env.get('SPOTIFY_CLIENT_ID') + ':' + Env.get('SPOTIFY_CLIENT_SECRET')).toString('base64'),
      },
    }
  );
}

function connectToSpotifyDealer() {
  const ws = new WebSocket(`wss://dealer.spotify.com/?access_token=${dealerSpotify}`);
  ws.onmessage = (e: any) => {
    const data = JSON.parse(e.data);
    if (data.headers && data.headers['Spotify-Connection-Id']) {
      connection_id = data.headers['Spotify-Connection-Id'];
    }

    connections.forEach((connection: WebSocket) => {
      connection.send(JSON.stringify(data));
    });
  };

  subscribeToEvents();
}

function subscribeToEvents() {
  if (connection_id && dealerSpotify) {
    axios
      .put(
        `https://api.spotify.com/v1/me/notifications/player?connection_id=${connection_id}`,
        {},
        {
          headers: {
            accept: 'application/json',
            authorization: `Bearer ${dealerSpotify}`,
          },
        }
      )
      .then((r: any) => {
        console.log(r.data);
      })
      .catch((error) => {
        console.error(error.response);
      });
  } else {
    setTimeout(() => {
      subscribeToEvents();
    }, 3000);
  }
}

async function requestSpotifyTokenFromDiscord() {
  // https://discord.com/api/v9/users/@me/connections/spotify/rrocha93/access-token
  let response;

  try {
    response = await axios.get('https://discord.com/api/v9/users/@me/connections/spotify/rrocha93/access-token', {
    headers: {
      authorization: Env.get('DISCORD_TOKEN') || '',
    }
  });
  } catch (e) {
    throw new Error('something went wrong');
  }

  dealerSpotify = response.data.access_token;
}

export { spotify };
