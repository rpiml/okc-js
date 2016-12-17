// @flow

import { redis } from '../src';

describe('redis tests', () =>{

  it('should be able to get and set keys', async () => {
    await redis.set("test_key", "value");
    expect(await redis.get("test_key")).toBe("value");
  });

});
