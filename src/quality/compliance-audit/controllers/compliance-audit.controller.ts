import { Controller, Get, Param, Query } from '@nestjs/common';
import { ComplianceAuditService } from '../services/compliance-audit.service';
import { ComplianceAuditResponseDto } from '../dto/compliance-audit.dto';

@Controller('quality/compliance-audits')
export class ComplianceAuditController {
    constructor(
        private readonly complianceAuditService: ComplianceAuditService,
    ) { }

    @Get()
    async findAll(): Promise<ComplianceAuditResponseDto[]> {
        return await this.complianceAuditService.findAll();
    }

    @Get('active')
    async findActive(): Promise<ComplianceAuditResponseDto[]> {
        return await this.complianceAuditService.findActive();
    }

    @Get('pending-follow-up')
    async findPendingFollowUp(): Promise<ComplianceAuditResponseDto[]> {
        return await this.complianceAuditService.findPendingFollowUp();
    }

    @Get('audit-type/:auditType')
    async findByAuditType(
        @Param('auditType') auditType: string,
    ): Promise<ComplianceAuditResponseDto[]> {
        return await this.complianceAuditService.findByAuditType(auditType);
    }

    @Get('compliance-status/:complianceStatus')
    async findByComplianceStatus(
        @Param('complianceStatus') complianceStatus: string,
    ): Promise<ComplianceAuditResponseDto[]> {
        return await this.complianceAuditService.findByComplianceStatus(complianceStatus);
    }

    @Get('date-range')
    async findByDateRange(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ): Promise<ComplianceAuditResponseDto[]> {
        return await this.complianceAuditService.findByDateRange(startDate, endDate);
    }

    @Get('uuid/:uuid')
    async findByUuid(
        @Param('uuid') uuid: string,
    ): Promise<ComplianceAuditResponseDto> {
        return await this.complianceAuditService.findByUuid(uuid);
    }

    @Get(':id')
    async findById(
        @Param('id') id: string,
    ): Promise<ComplianceAuditResponseDto> {
        return await this.complianceAuditService.findById(parseInt(id, 10));
    }
}
