import { Injectable, NotFoundException } from '@nestjs/common';
import { DistrictRepository } from '../repositories/district.repository';
import { DistrictResponseDto } from '../dto/district.dto';
import { DistrictEntity } from '../repositories/district.repository.interface';

@Injectable()
export class DistrictService {
  constructor(private readonly districtRepository: DistrictRepository) {}

  private mapToDto(entity: DistrictEntity): DistrictResponseDto {
    return {
      id: entity.id,
      uuid: entity.uuid,
      cityId: entity.city_id,
      name: entity.name,
      code: entity.code,
      isActive: entity.is_active,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<DistrictResponseDto[]> {
    const entities = await this.districtRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<DistrictResponseDto> {
    const entity = await this.districtRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`District with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<DistrictResponseDto> {
    const entity = await this.districtRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(`District with uuid ${uuid} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByCityId(cityId: number): Promise<DistrictResponseDto[]> {
    const entities = await this.districtRepository.findByCityId(cityId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findActive(): Promise<DistrictResponseDto[]> {
    const entities = await this.districtRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCityIdAndActive(cityId: number): Promise<DistrictResponseDto[]> {
    const entities =
      await this.districtRepository.findByCityIdAndActive(cityId);
    return entities.map((entity) => this.mapToDto(entity));
  }
}

