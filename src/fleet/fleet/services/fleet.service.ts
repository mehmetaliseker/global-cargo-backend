import { Injectable, NotFoundException } from '@nestjs/common';
import { FleetRepository } from '../repositories/fleet.repository';
import { FleetResponseDto } from '../dto/fleet.dto';
import { FleetEntity } from '../repositories/fleet.repository.interface';

@Injectable()
export class FleetService {
    constructor(private readonly fleetRepository: FleetRepository) { }

    private mapToDto(entity: FleetEntity): FleetResponseDto {
        return {
            id: entity.id,
            uuid: entity.uuid,
            fleetCode: entity.fleet_code,
            fleetName: entity.fleet_name,
            branchId: entity.branch_id ?? undefined,
            isActive: entity.is_active,
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString(),
        };
    }

    async findAll(): Promise<FleetResponseDto[]> {
        const entities = await this.fleetRepository.findAll();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findById(id: number): Promise<FleetResponseDto> {
        const entity = await this.fleetRepository.findById(id);
        if (!entity) {
            throw new NotFoundException(`Fleet with id ${id} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByFleetCode(fleetCode: string): Promise<FleetResponseDto> {
        const entity = await this.fleetRepository.findByFleetCode(fleetCode);
        if (!entity) {
            throw new NotFoundException(`Fleet with code ${fleetCode} not found`);
        }
        return this.mapToDto(entity);
    }

    async findActive(): Promise<FleetResponseDto[]> {
        const entities = await this.fleetRepository.findActive();
        return entities.map((entity) => this.mapToDto(entity));
    }
}
