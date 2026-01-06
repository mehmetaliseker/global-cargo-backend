import { Injectable, NotFoundException } from '@nestjs/common';
import { CityRepository } from '../repositories/city.repository';
import { CityResponseDto } from '../dto/city.dto';
import { CityEntity } from '../repositories/city.repository.interface';

@Injectable()
export class CityService {
  constructor(private readonly cityRepository: CityRepository) {}

  private mapToDto(entity: CityEntity): CityResponseDto {
    return {
      id: entity.id,
      uuid: entity.uuid,
      regionId: entity.region_id,
      name: entity.name,
      code: entity.code,
      isActive: entity.is_active,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<CityResponseDto[]> {
    const entities = await this.cityRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<CityResponseDto> {
    const entity = await this.cityRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`City with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<CityResponseDto> {
    const entity = await this.cityRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(`City with uuid ${uuid} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByRegionId(regionId: number): Promise<CityResponseDto[]> {
    const entities = await this.cityRepository.findByRegionId(regionId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findActive(): Promise<CityResponseDto[]> {
    const entities = await this.cityRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByRegionIdAndActive(regionId: number): Promise<CityResponseDto[]> {
    const entities =
      await this.cityRepository.findByRegionIdAndActive(regionId);
    return entities.map((entity) => this.mapToDto(entity));
  }
}

