import { Module } from '@nestjs/common';
import { DocumentTrackingService } from './document.service';
import { DocumentTrackingController } from './document.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PROGRESS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:5672'],
          queue: 'progress-queue',
        },
      },
    ]),
  ],
  controllers: [DocumentTrackingController],
  providers: [DocumentTrackingService],
})
export class DocumentTrackingModule {}
