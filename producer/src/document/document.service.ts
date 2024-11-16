import { Inject, Injectable } from '@nestjs/common';
import { ProgressDto } from './document.dto';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs';

@Injectable()
export class DocumentTrackingService {
  constructor(@Inject('PROGRESS_SERVICE') private rabbitClient: ClientProxy) {}
  placeOrder(progress: ProgressDto) {
    this.rabbitClient.emit('progress-update', progress);
    return { message: 'Progress Updated' };
  }
}
