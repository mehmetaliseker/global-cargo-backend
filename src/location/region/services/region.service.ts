import { Injectable, NotFoundException } from '@nestjs/common';
import { RegionRepository } from '../repositories/region.repository';
import { RegionResponseDto } from '../dto/region.dto';
import { RegionEntity } from '../repositories/region.repository.interface';

@Injectable()
export class RegionService {
  constructor(private readonly regionRepository: RegionRepository) {}

  private mapToDto(entity: RegionEntity): RegionResponseDto {
    return {
      id: entity.id,
      uuid: entity.uuid,
      countryId: entity.country_id,
      name: entity.name,
      code: entity.code,
      isActive: entity.is_active,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<RegionResponseDto[]> {
    const entities = await this.regionRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<RegionResponseDto> {
    const entity = await this.regionRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Region with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<RegionResponseDto> {
    const entity = await this.regionRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(`Region with uuid ${uuid} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByCountryId(countryId: number): Promise<RegionResponseDto[]> {
    const entities = await this.regionRepository.findByCountryId(countryId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findActive(): Promise<RegionResponseDto[]> {
    const entities = await this.regionRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCountryIdAndActive(
    countryId: number,
  ): Promise<RegionResponseDto[]> {
    const entities =
      await this.regionRepository.findByCountryIdAndActive(countryId);
    return entities.map((entity) => this.mapToDto(entity));
  }
}

