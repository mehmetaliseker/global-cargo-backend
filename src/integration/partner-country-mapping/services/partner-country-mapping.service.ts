import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PartnerCountryMappingRepository } from '../repositories/partner-country-mapping.repository';
import { PartnerCountryMappingResponseDto } from '../dto/partner-country-mapping.dto';
import { CreatePartnerCountryMappingDto } from '../dto/partner-country-mapping.dto';
import { UpdatePartnerCountryMappingDto } from '../dto/partner-country-mapping.dto';
import { PartnerCountryMappingEntity } from '../repositories/partner-country-mapping.repository.interface';

@Injectable()
export class PartnerCountryMappingService {
  constructor(
    private readonly partnerCountryMappingRepository: PartnerCountryMappingRepository,
  ) {}

  private mapToDto(
    entity: PartnerCountryMappingEntity,
  ): PartnerCountryMappingResponseDto {
    let mappingData: Record<string, unknown> | undefined;
    if (entity.mapping_data) {
      if (typeof entity.mapping_data === 'string') {
        mappingData = JSON.parse(entity.mapping_data);
      } else {
        mappingData = entity.mapping_data as Record<string, unknown>;
      }
    }

    return {
      id: entity.id,
      partnerId: entity.partner_id,
      countryId: entity.country_id,
      isActive: entity.is_active,
      mappingData,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<PartnerCountryMappingResponseDto[]> {
    const entities =
      await this.partnerCountryMappingRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(
    id: number,
  ): Promise<PartnerCountryMappingResponseDto> {
    const entity = await this.partnerCountryMappingRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Partner country mapping with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByPartnerId(
    partnerId: number,
  ): Promise<PartnerCountryMappingResponseDto[]> {
    const entities =
      await this.partnerCountryMappingRepository.findByPartnerId(partnerId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCountryId(
    countryId: number,
  ): Promise<PartnerCountryMappingResponseDto[]> {
    const entities =
      await this.partnerCountryMappingRepository.findByCountryId(countryId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByPartnerIdAndCountryId(
    partnerId: number,
    countryId: number,
  ): Promise<PartnerCountryMappingResponseDto | null> {
    const entity =
      await this.partnerCountryMappingRepository.findByPartnerIdAndCountryId(
        partnerId,
        countryId,
      );
    if (!entity) {
      return null;
    }
    return this.mapToDto(entity);
  }

  async findActive(): Promise<PartnerCountryMappingResponseDto[]> {
    const entities = await this.partnerCountryMappingRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByPartnerIdActive(
    partnerId: number,
  ): Promise<PartnerCountryMappingResponseDto[]> {
    const entities =
      await this.partnerCountryMappingRepository.findByPartnerIdActive(
        partnerId,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async create(
    createDto: CreatePartnerCountryMappingDto,
  ): Promise<PartnerCountryMappingResponseDto> {
    try {
      const entity = await this.partnerCountryMappingRepository.create(
        createDto.partnerId,
        createDto.countryId,
        createDto.isActive ?? true,
        createDto.mappingData ?? null,
      );
      return this.mapToDto(entity);
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message.includes('already exists')
      ) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  async update(
    id: number,
    updateDto: UpdatePartnerCountryMappingDto,
  ): Promise<PartnerCountryMappingResponseDto> {
    const existing = await this.partnerCountryMappingRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(
        `Partner country mapping with id ${id} not found`,
      );
    }

    const entity = await this.partnerCountryMappingRepository.update(
      id,
      updateDto.isActive ?? existing.is_active,
      updateDto.mappingData ?? undefined,
    );

    return this.mapToDto(entity);
  }

  async softDelete(id: number): Promise<void> {
    const existing = await this.partnerCountryMappingRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(
        `Partner country mapping with id ${id} not found`,
      );
    }
    await this.partnerCountryMappingRepository.softDelete(id);
  }
}

