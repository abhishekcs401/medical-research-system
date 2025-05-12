import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const QUEUE_NAME = 'delete-events';

let channel: amqp.Channel | null = null;

export const initRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    console.log('RabbitMQ channel created & queue asserted.');
  } catch (error) {
    console.error('Failed to initialize RabbitMQ:', error);
  }
};

export const publishDeleteEvent = async (payload: object) => {
  try {
    if (!channel) {
      await initRabbitMQ();
    }

    const message = Buffer.from(JSON.stringify(payload));
    channel?.sendToQueue(QUEUE_NAME, message, { persistent: true });
  } catch (error) {
    console.error('Failed to publish delete event:', error);
  }
};
