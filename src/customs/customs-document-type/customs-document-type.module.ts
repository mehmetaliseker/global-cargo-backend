import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CustomsDocumentTypeRepository } from './repositories/customs-document-type.repository';
import { CustomsDocumentTypeService } from './services/customs-document-type.service';
import { CustomsDocumentTypeController } from './controllers/customs-document-type.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CustomsDocumentTypeController],
  providers: [CustomsDocumentTypeRepository, CustomsDocumentTypeService],
  exports: [CustomsDocumentTypeService, CustomsDocumentTypeRepository],
})
export class CustomsDocumentTypeModule {}

