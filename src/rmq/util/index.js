// @flow

import { request, reply } from 'amqplib-rpc';
import amqplib from 'amqplib/callback_api';

import { getRabbitMQConnection } from './rabbitmq';
import config from '../../config';

export async function rpc(queue: string, message: string): Promise<string> {
  const rabbitmq = await getRabbitMQConnection();
  const reply = (await request(rabbitmq, queue, message)).content.toString();
  rabbitmq.close();
  return reply;
}

export async function rpcReply(queue: string, cb: any) {
  amqplib.connect(config.rabbitmqAddress, function (err, connection) {
    connection.createChannel(function(err, ch) {
          ch.assertQueue(queue, {durable: false});
          ch.prefetch(1);
          ch.consume(q, async (msg) => {
            let content = msg.content.toString();
            let response = await cb(content);
            ch.sendToQueue(msg.properties.replyTo,
              new Buffer(response));
            ch.ack(msg);
          });
        });

  });
}


export default rpc;
