import { Injectable, NotFoundException } from '@nestjs/common';
import { ContainerCargoAssignmentRepository } from '../repositories/container-cargo-assignment.repository';
import { ContainerCargoAssignmentResponseDto } from '../dto/container-cargo-assignment.dto';
import { ContainerCargoAssignmentEntity } from '../repositories/container-cargo-assignment.repository.interface';

@Injectable()
export class ContainerCargoAssignmentService {
    constructor(
        private readonly containerCargoAssignmentRepository: ContainerCargoAssignmentRepository,
    ) { }

    private mapToDto(
        entity: ContainerCargoAssignmentEntity,
    ): ContainerCargoAssignmentResponseDto {
        return {
            id: entity.id,
            containerId: entity.container_id,
            cargoId: entity.cargo_id,
            assignedDate: entity.assigned_date.toISOString(),
            loadedDate: entity.loaded_date?.toISOString(),
            unloadedDate: entity.unloaded_date?.toISOString(),
            positionInContainer: entity.position_in_container ?? undefined,
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString(),
        };
    }

    async findAll(): Promise<ContainerCargoAssignmentResponseDto[]> {
        const entities = await this.containerCargoAssignmentRepository.findAll();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findById(id: number): Promise<ContainerCargoAssignmentResponseDto> {
        const entity = await this.containerCargoAssignmentRepository.findById(id);
        if (!entity) {
            throw new NotFoundException(
                `Container cargo assignment with id ${id} not found`,
            );
        }
        return this.mapToDto(entity);
    }

    async findByContainerId(
        containerId: number,
    ): Promise<ContainerCargoAssignmentResponseDto[]> {
        const entities =
            await this.containerCargoAssignmentRepository.findByContainerId(
                containerId,
            );
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findByCargoId(
        cargoId: number,
    ): Promise<ContainerCargoAssignmentResponseDto[]> {
        const entities =
            await this.containerCargoAssignmentRepository.findByCargoId(cargoId);
        return entities.map((entity) => this.mapToDto(entity));
    }
}
