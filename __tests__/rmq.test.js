// @flow
import { rpc, rpcReply } from '../src/rmq';

describe('rabbitmq tests', () => {
  it('should respond to connections', async () => {
    rpcReply('some-queue', async a => `queue-response ${a}`);
    const response = await rpc('some-queue', '1');
    expect(response).toBe('queue-response 1');
    const response2 = await rpc('some-queue', '2');
    expect(response2).toBe('queue-response 2');
  });
  it('should allow for multiple replying connections', async () => {
    for (let i = 0; i < 10; i += 1) {
      rpcReply(`queue${i}`, async a => `queue${i}-response ${a}`);
    }
    for (let i = 0; i < 30; i += 1) {
      expect(await rpc(`queue${i % 10}`, 'a')).toEqual(`queue${i % 10}-response a`);
    }
  });
});
