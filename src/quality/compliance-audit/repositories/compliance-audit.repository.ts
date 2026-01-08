import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
    ComplianceAuditEntity,
    IComplianceAuditRepository,
} from './compliance-audit.repository.interface';

@Injectable()
export class ComplianceAuditRepository implements IComplianceAuditRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findAll(): Promise<ComplianceAuditEntity[]> {
        const query = `
      SELECT id, uuid, audit_type, audit_date, auditor_name, auditor_organization,
             findings, compliance_status, action_items, follow_up_date,
             follow_up_completed, created_at, updated_at, deleted_at
      FROM compliance_audit
      WHERE deleted_at IS NULL
      ORDER BY audit_date DESC
    `;
        return await this.databaseService.query<ComplianceAuditEntity>(query);
    }

    async findById(id: number): Promise<ComplianceAuditEntity | null> {
        const query = `
      SELECT id, uuid, audit_type, audit_date, auditor_name, auditor_organization,
             findings, compliance_status, action_items, follow_up_date,
             follow_up_completed, created_at, updated_at, deleted_at
      FROM compliance_audit
      WHERE id = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<ComplianceAuditEntity>(query, [id]);
    }

    async findByUuid(uuid: string): Promise<ComplianceAuditEntity | null> {
        const query = `
      SELECT id, uuid, audit_type, audit_date, auditor_name, auditor_organization,
             findings, compliance_status, action_items, follow_up_date,
             follow_up_completed, created_at, updated_at, deleted_at
      FROM compliance_audit
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<ComplianceAuditEntity>(query, [uuid]);
    }

    async findByAuditType(auditType: string): Promise<ComplianceAuditEntity[]> {
        const query = `
      SELECT id, uuid, audit_type, audit_date, auditor_name, auditor_organization,
             findings, compliance_status, action_items, follow_up_date,
             follow_up_completed, created_at, updated_at, deleted_at
      FROM compliance_audit
      WHERE audit_type = $1 AND deleted_at IS NULL
      ORDER BY audit_date DESC
    `;
        return await this.databaseService.query<ComplianceAuditEntity>(query, [auditType]);
    }

    async findByComplianceStatus(complianceStatus: string): Promise<ComplianceAuditEntity[]> {
        const query = `
      SELECT id, uuid, audit_type, audit_date, auditor_name, auditor_organization,
             findings, compliance_status, action_items, follow_up_date,
             follow_up_completed, created_at, updated_at, deleted_at
      FROM compliance_audit
      WHERE compliance_status = $1 AND deleted_at IS NULL
      ORDER BY audit_date DESC
    `;
        return await this.databaseService.query<ComplianceAuditEntity>(query, [complianceStatus]);
    }

    async findByDateRange(startDate: Date, endDate: Date): Promise<ComplianceAuditEntity[]> {
        const query = `
      SELECT id, uuid, audit_type, audit_date, auditor_name, auditor_organization,
             findings, compliance_status, action_items, follow_up_date,
             follow_up_completed, created_at, updated_at, deleted_at
      FROM compliance_audit
      WHERE audit_date BETWEEN $1 AND $2 AND deleted_at IS NULL
      ORDER BY audit_date DESC
    `;
        return await this.databaseService.query<ComplianceAuditEntity>(query, [startDate, endDate]);
    }

    async findPendingFollowUp(): Promise<ComplianceAuditEntity[]> {
        const query = `
      SELECT id, uuid, audit_type, audit_date, auditor_name, auditor_organization,
             findings, compliance_status, action_items, follow_up_date,
             follow_up_completed, created_at, updated_at, deleted_at
      FROM compliance_audit
      WHERE follow_up_completed = false 
        AND follow_up_date IS NOT NULL 
        AND follow_up_date <= CURRENT_DATE
        AND deleted_at IS NULL
      ORDER BY follow_up_date ASC
    `;
        return await this.databaseService.query<ComplianceAuditEntity>(query);
    }

    async findActive(): Promise<ComplianceAuditEntity[]> {
        const query = `
      SELECT id, uuid, audit_type, audit_date, auditor_name, auditor_organization,
             findings, compliance_status, action_items, follow_up_date,
             follow_up_completed, created_at, updated_at, deleted_at
      FROM compliance_audit
      WHERE deleted_at IS NULL
      ORDER BY audit_date DESC
      LIMIT 100
    `;
        return await this.databaseService.query<ComplianceAuditEntity>(query);
    }
}
