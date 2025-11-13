import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { VehiclesService } from '../vehicles/vehicles.service';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitService.name);

  private connection: any = null;
  private channel: any = null;

  constructor(private readonly vehiclesService: VehiclesService) {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.cleanup();
  }

  private async connect() {
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
      this.channel = await this.connection.createChannel();

      const queue = 'user_events';
      await this.channel.assertQueue(queue, { durable: true });

      this.logger.log(`✅ Listening to RabbitMQ queue: ${queue}`);

      this.channel.consume(queue, async (msg: amqp.ConsumeMessage | null) => {
        if (!msg) return;

        let content;
        try {
          content = JSON.parse(msg.content.toString());
        } catch (err) {
          this.logger.error('Invalid message format', err);
          this.channel!.nack(msg, false, false);
          return;
        }

        this.logger.debug(`📩 Received: ${JSON.stringify(content)}`);

        if (content.type === 'USER_CREATED') {
          try {
            await this.vehiclesService.createBlankForUser(content.data.id);
            this.logger.log(`🚗 Created blank vehicle for user: ${content.data.id}`);
            this.channel!.ack(msg);
          } catch (err) {
            this.logger.error(`❌ Failed to create vehicle for user ${content.data.id}`, err);
            this.channel!.nack(msg, false, true);
          }
        } else {
          this.channel!.ack(msg);
        }
      });

      // Handle connection closed by broker
      this.connection.on('close', () => {
        this.logger.warn('RabbitMQ connection closed. Reconnecting...');
        setTimeout(() => this.connect(), 5000);
      });

      this.connection.on('error', (err: Error) => {
        this.logger.error('RabbitMQ connection error:', err);
      });
    } catch (err) {
      this.logger.error('Failed to connect to RabbitMQ. Retrying in 5s...', err);
      setTimeout(() => this.connect(), 5000);
    }
  }

  private async cleanup() {
    try {
      this.logger.log('🧹 Closing RabbitMQ connection...');
      if (this.channel) {
        await this.channel.close();
        this.logger.log('✅ RabbitMQ channel closed');
      }
      if (this.connection) {
        await this.connection.close();
        this.logger.log('✅ RabbitMQ connection closed');
      }
    } catch (err) {
      this.logger.error('❌ Error during RabbitMQ cleanup:', err);
    }
  }
}
