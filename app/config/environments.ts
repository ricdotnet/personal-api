import { config } from 'dotenv';

config();
const env = {
  github: {
    username: process.env.GH_ACCESS_USERNAME || '',
    access_key: process.env.GH_ACCESS_TOKEN || '',
  },
  spotify: {
    client_id: process.env.SPOTIFY_CLIENT_ID || '',
    client_secret: process.env.SPOTIFY_CLIENT_SECRET || '',
    refresh_token: process.env.SPOTIFY_REFRESH_TOKEN || '',
  }
};

export { env };
