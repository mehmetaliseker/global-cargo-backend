import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CargoEventLogRepository } from './repositories/cargo-event-log.repository';
import { CargoEventLogService } from './services/cargo-event-log.service';
import { CargoEventLogController } from './controllers/cargo-event-log.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CargoEventLogController],
  providers: [CargoEventLogRepository, CargoEventLogService],
  exports: [CargoEventLogService, CargoEventLogRepository],
})
export class CargoEventLogModule {}

