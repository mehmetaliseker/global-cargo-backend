import { Injectable, NotFoundException } from '@nestjs/common';
import { PartnerRepository } from '../repositories/partner.repository';
import { PartnerResponseDto } from '../dto/partner.dto';
import { PartnerEntity } from '../repositories/partner.repository.interface';

@Injectable()
export class PartnerService {
  constructor(private readonly partnerRepository: PartnerRepository) {}

  private mapToDto(entity: PartnerEntity): PartnerResponseDto {
    return {
      id: entity.id,
      uuid: entity.uuid,
      actorId: entity.actor_id,
      companyName: entity.company_name,
      taxNumber: entity.tax_number,
      countryId: entity.country_id,
      apiActive: entity.api_active,
      isActive: entity.is_active,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<PartnerResponseDto[]> {
    const entities = await this.partnerRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<PartnerResponseDto> {
    const entity = await this.partnerRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Partner with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<PartnerResponseDto> {
    const entity = await this.partnerRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(`Partner with uuid ${uuid} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByActorId(actorId: number): Promise<PartnerResponseDto> {
    const entity = await this.partnerRepository.findByActorId(actorId);
    if (!entity) {
      throw new NotFoundException(
        `Partner with actor id ${actorId} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByCountryId(countryId: number): Promise<PartnerResponseDto[]> {
    const entities = await this.partnerRepository.findByCountryId(countryId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findActive(): Promise<PartnerResponseDto[]> {
    const entities = await this.partnerRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findApiActive(): Promise<PartnerResponseDto[]> {
    const entities = await this.partnerRepository.findApiActive();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCountryIdAndActive(
    countryId: number,
  ): Promise<PartnerResponseDto[]> {
    const entities =
      await this.partnerRepository.findByCountryIdAndActive(countryId);
    return entities.map((entity) => this.mapToDto(entity));
  }
}

