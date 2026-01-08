import { Module } from '@nestjs/common';
import { ComplianceAuditModule } from './compliance-audit/compliance-audit.module';

@Module({
    imports: [
        ComplianceAuditModule,
    ],
    exports: [
        ComplianceAuditModule,
    ],
})
export class QualityModule { }
