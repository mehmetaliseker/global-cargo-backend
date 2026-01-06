import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { PricingCalculationDetailRepository } from './repositories/pricing-calculation-detail.repository';
import { PricingCalculationDetailService } from './services/pricing-calculation-detail.service';
import { PricingCalculationDetailController } from './controllers/pricing-calculation-detail.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [PricingCalculationDetailController],
  providers: [
    PricingCalculationDetailRepository,
    PricingCalculationDetailService,
  ],
  exports: [
    PricingCalculationDetailService,
    PricingCalculationDetailRepository,
  ],
})
export class PricingCalculationDetailModule {}

