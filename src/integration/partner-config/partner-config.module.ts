import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { PartnerConfigRepository } from './repositories/partner-config.repository';
import { PartnerConfigService } from './services/partner-config.service';
import { PartnerConfigController } from './controllers/partner-config.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [PartnerConfigController],
  providers: [PartnerConfigRepository, PartnerConfigService],
  exports: [PartnerConfigService, PartnerConfigRepository],
})
export class PartnerConfigModule {}

