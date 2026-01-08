import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CustomsTaxCalculationRepository } from './repositories/customs-tax-calculation.repository';
import { CustomsTaxCalculationService } from './services/customs-tax-calculation.service';
import { CustomsTaxCalculationController } from './controllers/customs-tax-calculation.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CustomsTaxCalculationController],
  providers: [
    CustomsTaxCalculationRepository,
    CustomsTaxCalculationService,
  ],
  exports: [
    CustomsTaxCalculationService,
    CustomsTaxCalculationRepository,
  ],
})
export class CustomsTaxCalculationModule {}

