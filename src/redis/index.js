// @flow

import redis from 'redis';
import config from '../config';

export async function getClient() {
  return redis.getClient({
    host: config.redis.host,
  });
}

export async function get(key: string) {
  const client = redis.getClient();
  const value = await new Promise((resolve, reject) => {
    client.get(key, (err, reply) => {
      if (err) {
        reject(err);
      }
      resolve(reply.toString());
    });
  });
  client.close();
  return value;
}

export async function set(key: string, value: string) {
  const client = redis.getClient();
  client.set(key, value);
  client.close();
  return value;
}
