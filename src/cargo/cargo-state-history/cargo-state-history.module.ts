import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CargoStateHistoryRepository } from './repositories/cargo-state-history.repository';
import { CargoStateHistoryService } from './services/cargo-state-history.service';
import { CargoStateHistoryController } from './controllers/cargo-state-history.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CargoStateHistoryController],
  providers: [CargoStateHistoryRepository, CargoStateHistoryService],
  exports: [CargoStateHistoryService, CargoStateHistoryRepository],
})
export class CargoStateHistoryModule {}

