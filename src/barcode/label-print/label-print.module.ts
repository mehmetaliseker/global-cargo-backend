import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import {
  LabelConfigurationRepository,
  LabelPrintHistoryRepository,
} from './repositories/label-print.repository';
import {
  LabelConfigurationService,
  LabelPrintHistoryService,
} from './services/label-print.service';
import {
  LabelConfigurationController,
  LabelPrintHistoryController,
} from './controllers/label-print.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [
    LabelConfigurationController,
    LabelPrintHistoryController,
  ],
  providers: [
    LabelConfigurationRepository,
    LabelPrintHistoryRepository,
    LabelConfigurationService,
    LabelPrintHistoryService,
  ],
  exports: [
    LabelConfigurationService,
    LabelPrintHistoryService,
    LabelConfigurationRepository,
    LabelPrintHistoryRepository,
  ],
})
export class LabelPrintModule {}
