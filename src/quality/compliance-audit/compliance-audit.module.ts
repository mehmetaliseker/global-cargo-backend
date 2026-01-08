import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ComplianceAuditRepository } from './repositories/compliance-audit.repository';
import { ComplianceAuditService } from './services/compliance-audit.service';
import { ComplianceAuditController } from './controllers/compliance-audit.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [ComplianceAuditController],
    providers: [ComplianceAuditRepository, ComplianceAuditService],
    exports: [ComplianceAuditService, ComplianceAuditRepository],
})
export class ComplianceAuditModule { }
