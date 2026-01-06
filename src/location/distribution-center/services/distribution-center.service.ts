import { Injectable, NotFoundException } from '@nestjs/common';
import { DistributionCenterRepository } from '../repositories/distribution-center.repository';
import { DistributionCenterResponseDto } from '../dto/distribution-center.dto';
import { DistributionCenterEntity } from '../repositories/distribution-center.repository.interface';

@Injectable()
export class DistributionCenterService {
  constructor(
    private readonly distributionCenterRepository: DistributionCenterRepository,
  ) {}

  private mapToDto(
    entity: DistributionCenterEntity,
  ): DistributionCenterResponseDto {
    return {
      id: entity.id,
      uuid: entity.uuid,
      countryId: entity.country_id,
      cityId: entity.city_id,
      name: entity.name,
      code: entity.code,
      address: entity.address,
      latitude: entity.latitude,
      longitude: entity.longitude,
      isActive: entity.is_active,
      isTransferPoint: entity.is_transfer_point,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<DistributionCenterResponseDto[]> {
    const entities = await this.distributionCenterRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<DistributionCenterResponseDto> {
    const entity = await this.distributionCenterRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Distribution center with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<DistributionCenterResponseDto> {
    const entity = await this.distributionCenterRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(
        `Distribution center with uuid ${uuid} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByCountryId(
    countryId: number,
  ): Promise<DistributionCenterResponseDto[]> {
    const entities =
      await this.distributionCenterRepository.findByCountryId(countryId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCityId(cityId: number): Promise<DistributionCenterResponseDto[]> {
    const entities =
      await this.distributionCenterRepository.findByCityId(cityId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findActive(): Promise<DistributionCenterResponseDto[]> {
    const entities = await this.distributionCenterRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCountryIdAndActive(
    countryId: number,
  ): Promise<DistributionCenterResponseDto[]> {
    const entities =
      await this.distributionCenterRepository.findByCountryIdAndActive(
        countryId,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findTransferPoints(): Promise<DistributionCenterResponseDto[]> {
    const entities =
      await this.distributionCenterRepository.findTransferPoints();
    return entities.map((entity) => this.mapToDto(entity));
  }
}

