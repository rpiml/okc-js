// @flow

import redis from 'redis';
import config from '../config';

export async function getClient() {
  return redis.createClient({
    host: config.redis.host,
  });
}

export async function get(key: string) {
  const client = redis.createClient();
  const value = await new Promise((resolve, reject) => {
    client.get(key, (err, reply) => {
      if (err) {
        reject(err);
      }
      resolve(reply.toString());
    });
  });
  client.quit();
  return value;
}

export async function set(key: string, value: string) {
  const client = redis.createClient();
  client.set(key, value);
  client.quit();
  return value;
}
