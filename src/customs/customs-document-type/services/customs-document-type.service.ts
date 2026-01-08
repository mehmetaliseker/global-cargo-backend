import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CustomsDocumentTypeRepository } from '../repositories/customs-document-type.repository';
import {
  CustomsDocumentTypeResponseDto,
  CreateCustomsDocumentTypeDto,
  UpdateCustomsDocumentTypeDto,
} from '../dto/customs-document-type.dto';
import { CustomsDocumentTypeEntity } from '../repositories/customs-document-type.repository.interface';

@Injectable()
export class CustomsDocumentTypeService {
  constructor(
    private readonly customsDocumentTypeRepository: CustomsDocumentTypeRepository,
  ) {}

  private mapToDto(
    entity: CustomsDocumentTypeEntity,
  ): CustomsDocumentTypeResponseDto {
    let requiredFields: Record<string, unknown> | undefined;
    if (entity.required_fields) {
      if (typeof entity.required_fields === 'string') {
        requiredFields = JSON.parse(entity.required_fields);
      } else {
        requiredFields = entity.required_fields as Record<string, unknown>;
      }
    }

    return {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      description: entity.description ?? undefined,
      requiredFields,
      countrySpecific: entity.country_specific,
      countryId: entity.country_id ?? undefined,
      isActive: entity.is_active,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<CustomsDocumentTypeResponseDto[]> {
    const entities =
      await this.customsDocumentTypeRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<CustomsDocumentTypeResponseDto> {
    const entity = await this.customsDocumentTypeRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Customs document type with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByCode(code: string): Promise<CustomsDocumentTypeResponseDto> {
    const entity = await this.customsDocumentTypeRepository.findByCode(code);
    if (!entity) {
      throw new NotFoundException(
        `Customs document type with code ${code} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByCountryId(
    countryId: number,
  ): Promise<CustomsDocumentTypeResponseDto[]> {
    const entities =
      await this.customsDocumentTypeRepository.findByCountryId(countryId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findActive(): Promise<CustomsDocumentTypeResponseDto[]> {
    const entities = await this.customsDocumentTypeRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findActiveByCountryId(
    countryId: number,
  ): Promise<CustomsDocumentTypeResponseDto[]> {
    const entities =
      await this.customsDocumentTypeRepository.findActiveByCountryId(
        countryId,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async create(
    createDto: CreateCustomsDocumentTypeDto,
  ): Promise<CustomsDocumentTypeResponseDto> {
    const existing = await this.customsDocumentTypeRepository.findByCode(
      createDto.code,
    );
    if (existing) {
      throw new BadRequestException(
        `Customs document type with code ${createDto.code} already exists`,
      );
    }

    if (createDto.countrySpecific && !createDto.countryId) {
      throw new BadRequestException(
        'Country ID is required when country specific is true',
      );
    }

    if (!createDto.countrySpecific && createDto.countryId) {
      throw new BadRequestException(
        'Country ID cannot be set when country specific is false',
      );
    }

    const entity = await this.customsDocumentTypeRepository.create(
      createDto.code,
      createDto.name,
      createDto.description ?? null,
      createDto.requiredFields ?? null,
      createDto.countrySpecific,
      createDto.countryId ?? null,
    );

    return this.mapToDto(entity);
  }

  async update(
    id: number,
    updateDto: UpdateCustomsDocumentTypeDto,
  ): Promise<CustomsDocumentTypeResponseDto> {
    const existing = await this.customsDocumentTypeRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(
        `Customs document type with id ${id} not found`,
      );
    }

    const entity = await this.customsDocumentTypeRepository.update(
      id,
      updateDto.name,
      updateDto.description ?? null,
      updateDto.requiredFields ?? null,
      updateDto.isActive,
    );

    return this.mapToDto(entity);
  }

  async delete(id: number): Promise<void> {
    const existing = await this.customsDocumentTypeRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(
        `Customs document type with id ${id} not found`,
      );
    }

    await this.customsDocumentTypeRepository.softDelete(id);
  }
}

