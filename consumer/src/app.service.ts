import { Injectable } from '@nestjs/common';
import { ProgressDto } from './progress-update.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document, Status } from './entities/document.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}
  orders: ProgressDto[] = [];

  async handleProgressUpdateEvent(event: ProgressDto) {
    console.log(event);
    await this.documentRepository.update(
      { id: event.docId },
      {
        ingestionStatus: event.status as unknown as Status,
      },
    );
    this.orders.push(event);
  }
}
