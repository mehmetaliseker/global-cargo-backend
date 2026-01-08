import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CargoInsuranceRepository } from './repositories/cargo-insurance.repository';
import { CargoInsuranceService } from './services/cargo-insurance.service';
import { CargoInsuranceController } from './controllers/cargo-insurance.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CargoInsuranceController],
  providers: [CargoInsuranceRepository, CargoInsuranceService],
  exports: [CargoInsuranceService, CargoInsuranceRepository],
})
export class CargoInsuranceModule {}

