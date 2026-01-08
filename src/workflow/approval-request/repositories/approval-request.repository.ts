import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
    ApprovalRequestEntity,
    IApprovalRequestRepository,
} from './approval-request.repository.interface';

@Injectable()
export class ApprovalRequestRepository implements IApprovalRequestRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findAll(): Promise<ApprovalRequestEntity[]> {
        const query = `
      SELECT id, uuid, approval_chain_id, entity_type, entity_id,
             requested_by, current_level, status, requested_date,
             completed_date, created_at, updated_at
      FROM approval_request
      ORDER BY requested_date DESC
    `;
        return await this.databaseService.query<ApprovalRequestEntity>(query);
    }

    async findById(id: number): Promise<ApprovalRequestEntity | null> {
        const query = `
      SELECT id, uuid, approval_chain_id, entity_type, entity_id,
             requested_by, current_level, status, requested_date,
             completed_date, created_at, updated_at
      FROM approval_request
      WHERE id = $1
    `;
        return await this.databaseService.queryOne<ApprovalRequestEntity>(query, [
            id,
        ]);
    }

    async findByUuid(uuid: string): Promise<ApprovalRequestEntity | null> {
        const query = `
      SELECT id, uuid, approval_chain_id, entity_type, entity_id,
             requested_by, current_level, status, requested_date,
             completed_date, created_at, updated_at
      FROM approval_request
      WHERE uuid = $1
    `;
        return await this.databaseService.queryOne<ApprovalRequestEntity>(query, [
            uuid,
        ]);
    }

    async findByEntity(
        entityType: string,
        entityId: number,
    ): Promise<ApprovalRequestEntity[]> {
        const query = `
      SELECT id, uuid, approval_chain_id, entity_type, entity_id,
             requested_by, current_level, status, requested_date,
             completed_date, created_at, updated_at
      FROM approval_request
      WHERE entity_type = $1 AND entity_id = $2
      ORDER BY requested_date DESC
    `;
        return await this.databaseService.query<ApprovalRequestEntity>(query, [
            entityType,
            entityId,
        ]);
    }

    async findByStatus(status: string): Promise<ApprovalRequestEntity[]> {
        const query = `
      SELECT id, uuid, approval_chain_id, entity_type, entity_id,
             requested_by, current_level, status, requested_date,
             completed_date, created_at, updated_at
      FROM approval_request
      WHERE status = $1
      ORDER BY requested_date DESC
    `;
        return await this.databaseService.query<ApprovalRequestEntity>(query, [
            status,
        ]);
    }

    async findPending(): Promise<ApprovalRequestEntity[]> {
        const query = `
      SELECT id, uuid, approval_chain_id, entity_type, entity_id,
             requested_by, current_level, status, requested_date,
             completed_date, created_at, updated_at
      FROM approval_request
      WHERE status = 'pending'
      ORDER BY requested_date ASC
    `;
        return await this.databaseService.query<ApprovalRequestEntity>(query);
    }
}
