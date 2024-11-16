import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DocumentTrackingModule } from './document/document.module';

@Module({
  imports: [DocumentTrackingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
