// @flow

import { request } from 'amqplib-rpc';
import amqplib from 'amqplib/callback_api';

import { getRabbitMQConnection } from './rabbitmq';
import config from '../../config';

export async function rpc(queue: string, message: ?string): Promise<string> {
  const rabbitmq = await getRabbitMQConnection();
  const reply = (await request(rabbitmq, queue, message)).content.toString();
  rabbitmq.close();
  return reply;
}

/**
* Responds to a remote procedure call (rpc)
*/
export function rpcReply(queue: string, reply: (x: string) => Promise<string>) {
  amqplib.connect(config.rabbitmq.address, (err, connection) => {
    if (err) throw err;
    connection.createChannel((chErr, ch) => {
      if (chErr) throw chErr;
      ch.assertQueue(queue, { durable: false });
      ch.prefetch(1);
      ch.consume(queue, async (msg) => {
        const content = msg.content.toString();
        const response = await reply(content);
        ch.sendToQueue(msg.properties.replyTo,
              new Buffer(response),
             { correlationId: msg.properties.correlationId });
        ch.ack(msg);
      });
    });
  });
}


export default rpc;
