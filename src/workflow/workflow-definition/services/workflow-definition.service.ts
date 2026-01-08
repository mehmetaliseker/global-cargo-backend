import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkflowDefinitionRepository } from '../repositories/workflow-definition.repository';
import { WorkflowDefinitionResponseDto } from '../dto/workflow-definition.dto';
import { WorkflowDefinitionEntity } from '../repositories/workflow-definition.repository.interface';

@Injectable()
export class WorkflowDefinitionService {
    constructor(
        private readonly workflowDefinitionRepository: WorkflowDefinitionRepository,
    ) { }

    private mapToDto(
        entity: WorkflowDefinitionEntity,
    ): WorkflowDefinitionResponseDto {
        return {
            id: entity.id,
            uuid: entity.uuid,
            workflowName: entity.workflow_name,
            workflowCode: entity.workflow_code,
            workflowType: entity.workflow_type,
            steps: entity.steps,
            isActive: entity.is_active,
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString(),
        };
    }

    async findAll(): Promise<WorkflowDefinitionResponseDto[]> {
        const entities = await this.workflowDefinitionRepository.findAll();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findById(id: number): Promise<WorkflowDefinitionResponseDto> {
        const entity = await this.workflowDefinitionRepository.findById(id);
        if (!entity) {
            throw new NotFoundException(`Workflow definition with id ${id} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByUuid(uuid: string): Promise<WorkflowDefinitionResponseDto> {
        const entity = await this.workflowDefinitionRepository.findByUuid(uuid);
        if (!entity) {
            throw new NotFoundException(
                `Workflow definition with uuid ${uuid} not found`,
            );
        }
        return this.mapToDto(entity);
    }

    async findByWorkflowCode(
        workflowCode: string,
    ): Promise<WorkflowDefinitionResponseDto> {
        const entity =
            await this.workflowDefinitionRepository.findByWorkflowCode(workflowCode);
        if (!entity) {
            throw new NotFoundException(
                `Workflow definition with code ${workflowCode} not found`,
            );
        }
        return this.mapToDto(entity);
    }

    async findByWorkflowType(
        workflowType: string,
    ): Promise<WorkflowDefinitionResponseDto[]> {
        const entities =
            await this.workflowDefinitionRepository.findByWorkflowType(workflowType);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findActive(): Promise<WorkflowDefinitionResponseDto[]> {
        const entities = await this.workflowDefinitionRepository.findActive();
        return entities.map((entity) => this.mapToDto(entity));
    }
}
