import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CountryRiskRepository } from './repositories/country-risk.repository';
import { CountryRiskService } from './services/country-risk.service';
import { CountryRiskController } from './controllers/country-risk.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CountryRiskController],
  providers: [CountryRiskRepository, CountryRiskService],
  exports: [CountryRiskService, CountryRiskRepository],
})
export class CountryRiskModule {}

