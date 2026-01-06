import { Injectable, NotFoundException } from '@nestjs/common';
import { CargoTypeRepository } from '../repositories/cargo-type.repository';
import { CargoTypeResponseDto } from '../dto/cargo-type.dto';
import { CargoTypeEntity } from '../repositories/cargo-type.repository.interface';

@Injectable()
export class CargoTypeService {
  constructor(private readonly cargoTypeRepository: CargoTypeRepository) {}

  private mapToDto(entity: CargoTypeEntity): CargoTypeResponseDto {
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

  async findAll(): Promise<CargoTypeResponseDto[]> {
    const entities = await this.cargoTypeRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<CargoTypeResponseDto> {
    const entity = await this.cargoTypeRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Cargo type with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByCode(code: string): Promise<CargoTypeResponseDto> {
    const entity = await this.cargoTypeRepository.findByCode(code);
    if (!entity) {
      throw new NotFoundException(`Cargo type with code ${code} not found`);
    }
    return this.mapToDto(entity);
  }

  async findActive(): Promise<CargoTypeResponseDto[]> {
    const entities = await this.cargoTypeRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }
}

