import amqp from 'amqplib';
import { saveDeleteAudit } from '../services/audit.service';
import dotenv from 'dotenv';

dotenv.config();

const queue = process.env.QUEUE_NAME || 'delete-events';
const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://localhost';

export const startConsumer = async () => {
  try {
    const connection = await amqp.connect(rabbitUrl);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue);

    console.log(`🟢 Listening to queue: ${queue}`);

    channel.consume(queue, async msg => {
      if (msg !== null) {
        console.log('📩 Received message:', msg.content.toString());
        try {
          const content = JSON.parse(msg.content.toString());
          if (content && content.entity && content.entityId) {
            await saveDeleteAudit(content);
            channel.ack(msg);
          } else {
            console.warn('Received malformed delete event:', content);
            channel.nack(msg, false, false); // discard message
          }
        } catch (err) {
          console.error('Failed to process message:', err);
          channel.nack(msg, false, false); // discard message
        }
      }
    });
  } catch (error) {
    console.error('❌ Error in RabbitMQ consumer connection or channel creation:', error);
  }
};
