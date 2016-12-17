// @flow

const config = {
  rabbitmq: {
    address: `amqp://rabbitmq:rabbitmq@${process.env.RABBITMQ_HOST || '127.0.0.1'}`,
  },
  database: {
    name: process.env.PSQLDATABASE || 'okcollege_dev',
    host: process.env.PGHOST || 'localhost',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
  },
};

export default config;
