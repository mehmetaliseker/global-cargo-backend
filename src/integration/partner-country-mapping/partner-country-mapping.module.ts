import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { PartnerCountryMappingRepository } from './repositories/partner-country-mapping.repository';
import { PartnerCountryMappingService } from './services/partner-country-mapping.service';
import { PartnerCountryMappingController } from './controllers/partner-country-mapping.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [PartnerCountryMappingController],
  providers: [
    PartnerCountryMappingRepository,
    PartnerCountryMappingService,
  ],
  exports: [
    PartnerCountryMappingService,
    PartnerCountryMappingRepository,
  ],
})
export class PartnerCountryMappingModule {}

