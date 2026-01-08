import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CargoCustomsDocumentRepository } from './repositories/cargo-customs-document.repository';
import { CargoCustomsDocumentService } from './services/cargo-customs-document.service';
import { CargoCustomsDocumentController } from './controllers/cargo-customs-document.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CargoCustomsDocumentController],
  providers: [CargoCustomsDocumentRepository, CargoCustomsDocumentService],
  exports: [CargoCustomsDocumentService, CargoCustomsDocumentRepository],
})
export class CargoCustomsDocumentModule {}

