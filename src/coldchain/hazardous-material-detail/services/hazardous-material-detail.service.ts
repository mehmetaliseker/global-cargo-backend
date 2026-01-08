import { Injectable, NotFoundException } from '@nestjs/common';
import { HazardousMaterialDetailRepository } from '../repositories/hazardous-material-detail.repository';
import { HazardousMaterialDetailResponseDto } from '../dto/hazardous-material-detail.dto';
import { HazardousMaterialDetailEntity } from '../repositories/hazardous-material-detail.repository.interface';

@Injectable()
export class HazardousMaterialDetailService {
    constructor(
        private readonly hazardousMaterialDetailRepository: HazardousMaterialDetailRepository,
    ) { }

    private mapToDto(
        entity: HazardousMaterialDetailEntity,
    ): HazardousMaterialDetailResponseDto {
        return {
            id: entity.id,
            cargoId: entity.cargo_id,
            hazardClass: entity.hazard_class,
            unNumber: entity.un_number ?? undefined,
            packingGroup: entity.packing_group ?? undefined,
            properShippingName: entity.proper_shipping_name,
            emergencyContact: entity.emergency_contact ?? undefined,
            emergencyPhone: entity.emergency_phone ?? undefined,
            specialInstructions: entity.special_instructions ?? undefined,
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString(),
        };
    }

    async findAll(): Promise<HazardousMaterialDetailResponseDto[]> {
        const entities = await this.hazardousMaterialDetailRepository.findAll();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findById(id: number): Promise<HazardousMaterialDetailResponseDto> {
        const entity = await this.hazardousMaterialDetailRepository.findById(id);
        if (!entity) {
            throw new NotFoundException(
                `Hazardous material detail with id ${id} not found`,
            );
        }
        return this.mapToDto(entity);
    }

    async findByCargoId(
        cargoId: number,
    ): Promise<HazardousMaterialDetailResponseDto> {
        const entity =
            await this.hazardousMaterialDetailRepository.findByCargoId(cargoId);
        if (!entity) {
            throw new NotFoundException(
                `Hazardous material detail for cargo id ${cargoId} not found`,
            );
        }
        return this.mapToDto(entity);
    }

    async findByHazardClass(
        hazardClass: string,
    ): Promise<HazardousMaterialDetailResponseDto[]> {
        const entities =
            await this.hazardousMaterialDetailRepository.findByHazardClass(
                hazardClass,
            );
        return entities.map((entity) => this.mapToDto(entity));
    }
}
