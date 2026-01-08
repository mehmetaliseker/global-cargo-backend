import { Injectable, NotFoundException } from '@nestjs/common';
import { ApprovalRequestRepository } from '../repositories/approval-request.repository';
import { ApprovalRequestResponseDto } from '../dto/approval-request.dto';
import { ApprovalRequestEntity } from '../repositories/approval-request.repository.interface';

@Injectable()
export class ApprovalRequestService {
    constructor(
        private readonly approvalRequestRepository: ApprovalRequestRepository,
    ) { }

    private mapToDto(entity: ApprovalRequestEntity): ApprovalRequestResponseDto {
        return {
            id: entity.id,
            uuid: entity.uuid,
            approvalChainId: entity.approval_chain_id,
            entityType: entity.entity_type,
            entityId: entity.entity_id,
            requestedBy: entity.requested_by ?? undefined,
            currentLevel: entity.current_level,
            status: entity.status,
            requestedDate: entity.requested_date.toISOString(),
            completedDate: entity.completed_date?.toISOString(),
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString(),
        };
    }

    async findAll(): Promise<ApprovalRequestResponseDto[]> {
        const entities = await this.approvalRequestRepository.findAll();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findById(id: number): Promise<ApprovalRequestResponseDto> {
        const entity = await this.approvalRequestRepository.findById(id);
        if (!entity) {
            throw new NotFoundException(`Approval request with id ${id} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByUuid(uuid: string): Promise<ApprovalRequestResponseDto> {
        const entity = await this.approvalRequestRepository.findByUuid(uuid);
        if (!entity) {
            throw new NotFoundException(`Approval request with uuid ${uuid} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByEntity(
        entityType: string,
        entityId: number,
    ): Promise<ApprovalRequestResponseDto[]> {
        const entities = await this.approvalRequestRepository.findByEntity(
            entityType,
            entityId,
        );
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findByStatus(status: string): Promise<ApprovalRequestResponseDto[]> {
        const entities = await this.approvalRequestRepository.findByStatus(status);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findPending(): Promise<ApprovalRequestResponseDto[]> {
        const entities = await this.approvalRequestRepository.findPending();
        return entities.map((entity) => this.mapToDto(entity));
    }
}
