import { Injectable, NotFoundException } from '@nestjs/common';
import { ComplianceAuditRepository } from '../repositories/compliance-audit.repository';
import { ComplianceAuditResponseDto } from '../dto/compliance-audit.dto';
import { ComplianceAuditEntity } from '../repositories/compliance-audit.repository.interface';

@Injectable()
export class ComplianceAuditService {
    constructor(
        private readonly complianceAuditRepository: ComplianceAuditRepository,
    ) { }

    private mapToDto(entity: ComplianceAuditEntity): ComplianceAuditResponseDto {
        return {
            id: entity.id,
            uuid: entity.uuid,
            auditType: entity.audit_type,
            auditDate: entity.audit_date.toISOString().split('T')[0],
            auditorName: entity.auditor_name ?? undefined,
            auditorOrganization: entity.auditor_organization ?? undefined,
            findings: entity.findings ?? undefined,
            complianceStatus: entity.compliance_status,
            actionItems: entity.action_items ?? undefined,
            followUpDate: entity.follow_up_date ? entity.follow_up_date.toISOString().split('T')[0] : undefined,
            followUpCompleted: entity.follow_up_completed,
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString(),
        };
    }

    async findAll(): Promise<ComplianceAuditResponseDto[]> {
        const entities = await this.complianceAuditRepository.findAll();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findById(id: number): Promise<ComplianceAuditResponseDto> {
        const entity = await this.complianceAuditRepository.findById(id);
        if (!entity) {
            throw new NotFoundException(`Compliance audit with id ${id} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByUuid(uuid: string): Promise<ComplianceAuditResponseDto> {
        const entity = await this.complianceAuditRepository.findByUuid(uuid);
        if (!entity) {
            throw new NotFoundException(`Compliance audit with uuid ${uuid} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByAuditType(auditType: string): Promise<ComplianceAuditResponseDto[]> {
        const entities = await this.complianceAuditRepository.findByAuditType(auditType);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findByComplianceStatus(complianceStatus: string): Promise<ComplianceAuditResponseDto[]> {
        const entities = await this.complianceAuditRepository.findByComplianceStatus(complianceStatus);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findByDateRange(startDate: string, endDate: string): Promise<ComplianceAuditResponseDto[]> {
        const entities = await this.complianceAuditRepository.findByDateRange(
            new Date(startDate),
            new Date(endDate),
        );
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findPendingFollowUp(): Promise<ComplianceAuditResponseDto[]> {
        const entities = await this.complianceAuditRepository.findPendingFollowUp();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findActive(): Promise<ComplianceAuditResponseDto[]> {
        const entities = await this.complianceAuditRepository.findActive();
        return entities.map((entity) => this.mapToDto(entity));
    }
}
