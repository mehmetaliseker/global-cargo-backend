import { Module } from '@nestjs/common';
import { PartnerConfigModule } from './partner-config/partner-config.module';
import { PartnerCountryMappingModule } from './partner-country-mapping/partner-country-mapping.module';

@Module({
  imports: [PartnerConfigModule, PartnerCountryMappingModule],
  exports: [PartnerConfigModule, PartnerCountryMappingModule],
})
export class IntegrationModule {}

