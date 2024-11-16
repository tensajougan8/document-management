import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ProgressDto } from './progress-update.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('progress-update')
  handleUpdateEvent(@Payload() order: ProgressDto) {
    return this.appService.handleProgressUpdateEvent(order);
  }
}
