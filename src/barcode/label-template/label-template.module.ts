import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { LabelTemplateRepository } from './repositories/label-template.repository';
import { LabelTemplateService } from './services/label-template.service';
import { LabelTemplateController } from './controllers/label-template.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [LabelTemplateController],
  providers: [LabelTemplateRepository, LabelTemplateService],
  exports: [LabelTemplateService, LabelTemplateRepository],
})
export class LabelTemplateModule {}
