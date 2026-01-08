import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TaxRegulationVersionRepository } from '../repositories/tax-regulation-version.repository';
import {
  TaxRegulationVersionResponseDto,
  CreateTaxRegulationVersionDto,
  UpdateTaxRegulationVersionDto,
} from '../dto/tax-regulation-version.dto';
import { TaxRegulationVersionEntity } from '../repositories/tax-regulation-version.repository.interface';

@Injectable()
export class TaxRegulationVersionService {
  constructor(
    private readonly taxRegulationVersionRepository: TaxRegulationVersionRepository,
  ) {}

  private mapToDto(
    entity: TaxRegulationVersionEntity,
  ): TaxRegulationVersionResponseDto {
    let regulationData: Record<string, unknown>;
    if (typeof entity.regulation_data === 'string') {
      regulationData = JSON.parse(entity.regulation_data);
    } else {
      regulationData = entity.regulation_data as Record<string, unknown>;
    }

    return {
      id: entity.id,
      countryId: entity.country_id,
      year: entity.year,
      regulationData,
      effectiveFrom: entity.effective_from.toISOString(),
      effectiveTo: entity.effective_to?.toISOString(),
      isActive: entity.is_active,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<TaxRegulationVersionResponseDto[]> {
    const entities = await this.taxRegulationVersionRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<TaxRegulationVersionResponseDto> {
    const entity = await this.taxRegulationVersionRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Tax regulation version with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByCountryId(
    countryId: number,
  ): Promise<TaxRegulationVersionResponseDto[]> {
    const entities =
      await this.taxRegulationVersionRepository.findByCountryId(countryId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCountryIdAndYear(
    countryId: number,
    year: number,
  ): Promise<TaxRegulationVersionResponseDto> {
    const entity =
      await this.taxRegulationVersionRepository.findByCountryIdAndYear(
        countryId,
        year,
      );
    if (!entity) {
      throw new NotFoundException(
        `Tax regulation version for country ${countryId} and year ${year} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findActiveByCountryId(
    countryId: number,
  ): Promise<TaxRegulationVersionResponseDto[]> {
    const entities =
      await this.taxRegulationVersionRepository.findActiveByCountryId(
        countryId,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findActiveByCountryIdAndDate(
    countryId: number,
    date: Date,
  ): Promise<TaxRegulationVersionResponseDto | null> {
    const entity =
      await this.taxRegulationVersionRepository.findActiveByCountryIdAndDate(
        countryId,
        date,
      );
    if (!entity) {
      return null;
    }
    return this.mapToDto(entity);
  }

  async create(
    createDto: CreateTaxRegulationVersionDto,
  ): Promise<TaxRegulationVersionResponseDto> {
    const existing =
      await this.taxRegulationVersionRepository.findByCountryIdAndYear(
        createDto.countryId,
        createDto.year,
      );
    if (existing) {
      throw new BadRequestException(
        `Tax regulation version for country ${createDto.countryId} and year ${createDto.year} already exists`,
      );
    }

    const effectiveFrom = new Date(createDto.effectiveFrom);
    const effectiveTo = createDto.effectiveTo
      ? new Date(createDto.effectiveTo)
      : null;

    if (effectiveTo && effectiveTo < effectiveFrom) {
      throw new BadRequestException(
        'Effective to date cannot be before effective from date',
      );
    }

    const entity = await this.taxRegulationVersionRepository.create(
      createDto.countryId,
      createDto.year,
      createDto.regulationData,
      effectiveFrom,
      effectiveTo,
    );

    return this.mapToDto(entity);
  }

  async update(
    id: number,
    updateDto: UpdateTaxRegulationVersionDto,
  ): Promise<TaxRegulationVersionResponseDto> {
    const existing = await this.taxRegulationVersionRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(
        `Tax regulation version with id ${id} not found`,
      );
    }

    const effectiveFrom = new Date(updateDto.effectiveFrom);
    const effectiveTo = updateDto.effectiveTo
      ? new Date(updateDto.effectiveTo)
      : null;

    if (effectiveTo && effectiveTo < effectiveFrom) {
      throw new BadRequestException(
        'Effective to date cannot be before effective from date',
      );
    }

    const entity = await this.taxRegulationVersionRepository.update(
      id,
      updateDto.regulationData,
      effectiveFrom,
      effectiveTo,
      updateDto.isActive,
    );

    return this.mapToDto(entity);
  }

  async delete(id: number): Promise<void> {
    const existing = await this.taxRegulationVersionRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(
        `Tax regulation version with id ${id} not found`,
      );
    }

    await this.taxRegulationVersionRepository.softDelete(id);
  }
}

