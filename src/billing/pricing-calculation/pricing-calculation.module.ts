import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { PricingCalculationRepository } from './repositories/pricing-calculation.repository';
import { PricingCalculationService } from './services/pricing-calculation.service';
import { PricingCalculationController } from './controllers/pricing-calculation.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [PricingCalculationController],
  providers: [PricingCalculationRepository, PricingCalculationService],
  exports: [PricingCalculationService, PricingCalculationRepository],
})
export class PricingCalculationModule {}

