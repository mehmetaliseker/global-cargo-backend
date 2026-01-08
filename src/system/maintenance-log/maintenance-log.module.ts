import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { MaintenanceLogRepository } from './repositories/maintenance-log.repository';
import { MaintenanceLogService } from './services/maintenance-log.service';
import { MaintenanceLogController } from './controllers/maintenance-log.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [MaintenanceLogController],
  providers: [MaintenanceLogRepository, MaintenanceLogService],
  exports: [MaintenanceLogService, MaintenanceLogRepository],
})
export class MaintenanceLogModule {}
