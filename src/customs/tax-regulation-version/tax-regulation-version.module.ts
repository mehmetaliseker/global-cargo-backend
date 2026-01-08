import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { TaxRegulationVersionRepository } from './repositories/tax-regulation-version.repository';
import { TaxRegulationVersionService } from './services/tax-regulation-version.service';
import { TaxRegulationVersionController } from './controllers/tax-regulation-version.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [TaxRegulationVersionController],
  providers: [TaxRegulationVersionRepository, TaxRegulationVersionService],
  exports: [TaxRegulationVersionService, TaxRegulationVersionRepository],
})
export class TaxRegulationVersionModule {}

