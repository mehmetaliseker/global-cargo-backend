import { Injectable, NotFoundException } from '@nestjs/common';
import { PackagingTypeRepository } from '../repositories/packaging-type.repository';
import { PackagingTypeResponseDto } from '../dto/packaging-type.dto';
import { PackagingTypeEntity } from '../repositories/packaging-type.repository.interface';

@Injectable()
export class PackagingTypeService {
  constructor(
    private readonly packagingTypeRepository: PackagingTypeRepository,
  ) {}

  private mapToDto(entity: PackagingTypeEntity): PackagingTypeResponseDto {
    return {
      id: entity.id,
      uuid: entity.uuid,
      typeCode: entity.type_code,
      typeName: entity.type_name,
      description: entity.description ?? undefined,
      specialRequirements: entity.special_requirements ?? undefined,
      costAdditional: parseFloat(entity.cost_additional.toString()),
      isActive: entity.is_active,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<PackagingTypeResponseDto[]> {
    const entities = await this.packagingTypeRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<PackagingTypeResponseDto> {
    const entity = await this.packagingTypeRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Packaging type with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<PackagingTypeResponseDto> {
    const entity = await this.packagingTypeRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(
        `Packaging type with uuid ${uuid} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByCode(typeCode: string): Promise<PackagingTypeResponseDto> {
    const entity = await this.packagingTypeRepository.findByCode(typeCode);
    if (!entity) {
      throw new NotFoundException(
        `Packaging type with code ${typeCode} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findActive(): Promise<PackagingTypeResponseDto[]> {
    const entities = await this.packagingTypeRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }
}
