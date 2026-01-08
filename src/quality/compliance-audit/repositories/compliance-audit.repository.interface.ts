export interface ComplianceAuditEntity {
    id: number;
    uuid: string;
    audit_type: string;
    audit_date: Date;
    auditor_name?: string;
    auditor_organization?: string;
    findings?: any;
    compliance_status: string;
    action_items?: any;
    follow_up_date?: Date;
    follow_up_completed: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}

export interface IComplianceAuditRepository {
    findAll(): Promise<ComplianceAuditEntity[]>;
    findById(id: number): Promise<ComplianceAuditEntity | null>;
    findByUuid(uuid: string): Promise<ComplianceAuditEntity | null>;
    findByAuditType(auditType: string): Promise<ComplianceAuditEntity[]>;
    findByComplianceStatus(complianceStatus: string): Promise<ComplianceAuditEntity[]>;
    findByDateRange(startDate: Date, endDate: Date): Promise<ComplianceAuditEntity[]>;
    findPendingFollowUp(): Promise<ComplianceAuditEntity[]>;
    findActive(): Promise<ComplianceAuditEntity[]>;
}
