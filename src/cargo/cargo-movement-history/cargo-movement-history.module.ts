import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CargoMovementHistoryRepository } from './repositories/cargo-movement-history.repository';
import { CargoMovementHistoryService } from './services/cargo-movement-history.service';
import { CargoMovementHistoryController } from './controllers/cargo-movement-history.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CargoMovementHistoryController],
  providers: [CargoMovementHistoryRepository, CargoMovementHistoryService],
  exports: [CargoMovementHistoryService, CargoMovementHistoryRepository],
})
export class CargoMovementHistoryModule {}

