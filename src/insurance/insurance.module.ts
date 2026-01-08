import { Module } from '@nestjs/common';
import { CargoInsuranceModule } from './cargo-insurance/cargo-insurance.module';

@Module({
  imports: [CargoInsuranceModule],
  exports: [CargoInsuranceModule],
})
export class InsuranceModule {}

