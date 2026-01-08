export interface ApprovalRequestEntity {
    id: number;
    uuid: string;
    approval_chain_id: number;
    entity_type: string;
    entity_id: number;
    requested_by?: number;
    current_level: number;
    status: string;
    requested_date: Date;
    completed_date?: Date;
    created_at: Date;
    updated_at: Date;
}

export interface IApprovalRequestRepository {
    findAll(): Promise<ApprovalRequestEntity[]>;
    findById(id: number): Promise<ApprovalRequestEntity | null>;
    findByUuid(uuid: string): Promise<ApprovalRequestEntity | null>;
    findByEntity(entityType: string, entityId: number): Promise<ApprovalRequestEntity[]>;
    findByStatus(status: string): Promise<ApprovalRequestEntity[]>;
    findPending(): Promise<ApprovalRequestEntity[]>;
}
