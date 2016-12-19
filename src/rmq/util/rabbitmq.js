import { connect as rabbitmqConnect } from 'amqplib';
import config from '../../config';

async function createRabbitMQConnection() {
  const conn = await rabbitmqConnect(config.rabbitmq.address);
  return conn;
}

export const getRabbitMQConnection = () => createRabbitMQConnection();
