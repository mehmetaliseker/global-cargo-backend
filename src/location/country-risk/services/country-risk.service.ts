import { Injectable, NotFoundException } from '@nestjs/common';
import { CountryRiskRepository } from '../repositories/country-risk.repository';
import { CountryRiskResponseDto } from '../dto/country-risk.dto';
import { CountryRiskEntity } from '../repositories/country-risk.repository.interface';

@Injectable()
export class CountryRiskService {
  constructor(private readonly countryRiskRepository: CountryRiskRepository) {}

  private mapToDto(entity: CountryRiskEntity): CountryRiskResponseDto {
    return {
      id: entity.id,
      countryId: entity.country_id,
      riskLevel: entity.risk_level,
      riskScore: entity.risk_score,
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<CountryRiskResponseDto[]> {
    const entities = await this.countryRiskRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<CountryRiskResponseDto> {
    const entity = await this.countryRiskRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Country risk with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByCountryId(countryId: number): Promise<CountryRiskResponseDto> {
    const entity =
      await this.countryRiskRepository.findByCountryId(countryId);
    if (!entity) {
      throw new NotFoundException(
        `Country risk for country id ${countryId} not found`,
      );
    }
    return this.mapToDto(entity);
  }
}

