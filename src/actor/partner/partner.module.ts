import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { PartnerRepository } from './repositories/partner.repository';
import { PartnerService } from './services/partner.service';
import { PartnerController } from './controllers/partner.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [PartnerController],
  providers: [PartnerRepository, PartnerService],
  exports: [PartnerService, PartnerRepository],
})
export class PartnerModule {}

