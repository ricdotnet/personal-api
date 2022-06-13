import { config } from 'dotenv';

export class Env {
  constructor() {
    config();
  }

  static get(key: string) {
    return process.env[key];
  }
}
