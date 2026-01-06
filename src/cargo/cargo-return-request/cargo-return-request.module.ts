import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CargoReturnRequestRepository } from './repositories/cargo-return-request.repository';
import { CargoReturnRequestService } from './services/cargo-return-request.service';
import { CargoReturnRequestController } from './controllers/cargo-return-request.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CargoReturnRequestController],
  providers: [CargoReturnRequestRepository, CargoReturnRequestService],
  exports: [CargoReturnRequestService, CargoReturnRequestRepository],
})
export class CargoReturnRequestModule {}

