import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
    WorkflowDefinitionEntity,
    IWorkflowDefinitionRepository,
} from './workflow-definition.repository.interface';

@Injectable()
export class WorkflowDefinitionRepository
    implements IWorkflowDefinitionRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findAll(): Promise<WorkflowDefinitionEntity[]> {
        const query = `
      SELECT id, uuid, workflow_name, workflow_code, workflow_type,
             steps, is_active, created_at, updated_at, deleted_at
      FROM workflow_definition
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;
        return await this.databaseService.query<WorkflowDefinitionEntity>(query);
    }

    async findById(id: number): Promise<WorkflowDefinitionEntity | null> {
        const query = `
      SELECT id, uuid, workflow_name, workflow_code, workflow_type,
             steps, is_active, created_at, updated_at, deleted_at
      FROM workflow_definition
      WHERE id = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<WorkflowDefinitionEntity>(query, [
            id,
        ]);
    }

    async findByUuid(uuid: string): Promise<WorkflowDefinitionEntity | null> {
        const query = `
      SELECT id, uuid, workflow_name, workflow_code, workflow_type,
             steps, is_active, created_at, updated_at, deleted_at
      FROM workflow_definition
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<WorkflowDefinitionEntity>(query, [
            uuid,
        ]);
    }

    async findByWorkflowCode(
        workflowCode: string,
    ): Promise<WorkflowDefinitionEntity | null> {
        const query = `
      SELECT id, uuid, workflow_name, workflow_code, workflow_type,
             steps, is_active, created_at, updated_at, deleted_at
      FROM workflow_definition
      WHERE workflow_code = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<WorkflowDefinitionEntity>(query, [
            workflowCode,
        ]);
    }

    async findByWorkflowType(
        workflowType: string,
    ): Promise<WorkflowDefinitionEntity[]> {
        const query = `
      SELECT id, uuid, workflow_name, workflow_code, workflow_type,
             steps, is_active, created_at, updated_at, deleted_at
      FROM workflow_definition
      WHERE workflow_type = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
        return await this.databaseService.query<WorkflowDefinitionEntity>(query, [
            workflowType,
        ]);
    }

    async findActive(): Promise<WorkflowDefinitionEntity[]> {
        const query = `
      SELECT id, uuid, workflow_name, workflow_code, workflow_type,
             steps, is_active, created_at, updated_at, deleted_at
      FROM workflow_definition
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
        return await this.databaseService.query<WorkflowDefinitionEntity>(query);
    }
}
