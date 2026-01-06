import { Injectable, NotFoundException } from '@nestjs/common';
import { ShipmentTypeRepository } from '../repositories/shipment-type.repository';
import { ShipmentTypeResponseDto } from '../dto/shipment-type.dto';
import { ShipmentTypeEntity } from '../repositories/shipment-type.repository.interface';

@Injectable()
export class ShipmentTypeService {
  constructor(
    private readonly shipmentTypeRepository: ShipmentTypeRepository,
  ) {}

  private mapToDto(entity: ShipmentTypeEntity): ShipmentTypeResponseDto {
    return {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      description: entity.description,
      isActive: entity.is_active,
      createdAt: entity.created_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<ShipmentTypeResponseDto[]> {
    const entities = await this.shipmentTypeRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<ShipmentTypeResponseDto> {
    const entity = await this.shipmentTypeRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Shipment type with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByCode(code: string): Promise<ShipmentTypeResponseDto> {
    const entity = await this.shipmentTypeRepository.findByCode(code);
    if (!entity) {
      throw new NotFoundException(
        `Shipment type with code ${code} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findActive(): Promise<ShipmentTypeResponseDto[]> {
    const entities = await this.shipmentTypeRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }
}

