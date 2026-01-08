import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ChangeDataCaptureRepository } from './repositories/change-data-capture.repository';
import { ChangeDataCaptureService } from './services/change-data-capture.service';
import { ChangeDataCaptureController } from './controllers/change-data-capture.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ChangeDataCaptureController],
  providers: [ChangeDataCaptureRepository, ChangeDataCaptureService],
  exports: [ChangeDataCaptureService, ChangeDataCaptureRepository],
})
export class ChangeDataCaptureModule {}
