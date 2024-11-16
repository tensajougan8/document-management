import { Body, Controller, Get, Post } from '@nestjs/common';
import { DocumentTrackingService } from './document.service';
import { ProgressDto } from './document.dto';

@Controller('documents')
export class DocumentTrackingController {
  constructor(
    private readonly documentTrackingService: DocumentTrackingService,
  ) {}

  @Post('processing')
  placeOrder(@Body() order: ProgressDto) {
    return this.documentTrackingService.placeOrder(order);
  }
}
