import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { PartnerCommissionRepository } from './repositories/partner-commission.repository';
import { PartnerCommissionService } from './services/partner-commission.service';
import { PartnerCommissionController } from './controllers/partner-commission.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [PartnerCommissionController],
    providers: [PartnerCommissionRepository, PartnerCommissionService],
    exports: [PartnerCommissionService, PartnerCommissionRepository],
})
export class PartnerCommissionModule { }
