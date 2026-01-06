import { Injectable, NotFoundException } from '@nestjs/common';
import { CountryRepository } from '../repositories/country.repository';
import { CountryResponseDto } from '../dto/country.dto';
import { CountryEntity } from '../repositories/country.repository.interface';

@Injectable()
export class CountryService {
  constructor(private readonly countryRepository: CountryRepository) {}

  private mapToDto(entity: CountryEntity): CountryResponseDto {
    return {
      id: entity.id,
      uuid: entity.uuid,
      isoCode: entity.iso_code,
      isoCode2: entity.iso_code_2,
      name: entity.name,
      isActive: entity.is_active,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<CountryResponseDto[]> {
    const entities = await this.countryRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<CountryResponseDto> {
    const entity = await this.countryRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Country with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<CountryResponseDto> {
    const entity = await this.countryRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(`Country with uuid ${uuid} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByIsoCode(isoCode: string): Promise<CountryResponseDto> {
    const entity = await this.countryRepository.findByIsoCode(isoCode);
    if (!entity) {
      throw new NotFoundException(`Country with ISO code ${isoCode} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByIsoCode2(isoCode2: string): Promise<CountryResponseDto> {
    const entity = await this.countryRepository.findByIsoCode2(isoCode2);
    if (!entity) {
      throw new NotFoundException(
        `Country with ISO code 2 ${isoCode2} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findActive(): Promise<CountryResponseDto[]> {
    const entities = await this.countryRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }
}

