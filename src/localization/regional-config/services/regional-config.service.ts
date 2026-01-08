import { Injectable, NotFoundException } from '@nestjs/common';
import { RegionalConfigRepository } from '../repositories/regional-config.repository';
import { RegionalConfigResponseDto } from '../dto/regional-config.dto';
import { RegionalConfigEntity } from '../repositories/regional-config.repository.interface';

@Injectable()
export class RegionalConfigService {
    constructor(
        private readonly regionalConfigRepository: RegionalConfigRepository,
    ) { }

    private mapToDto(entity: RegionalConfigEntity): RegionalConfigResponseDto {
        return {
            id: entity.id,
            countryId: entity.country_id ?? undefined,
            regionId: entity.region_id ?? undefined,
            configKey: entity.config_key,
            configValue: entity.config_value,
            description: entity.description ?? undefined,
            isActive: entity.is_active,
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString(),
        };
    }

    async findAll(): Promise<RegionalConfigResponseDto[]> {
        const entities = await this.regionalConfigRepository.findAll();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findById(id: number): Promise<RegionalConfigResponseDto> {
        const entity = await this.regionalConfigRepository.findById(id);
        if (!entity) {
            throw new NotFoundException(`Regional config with id ${id} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByCountryId(countryId: number): Promise<RegionalConfigResponseDto[]> {
        const entities = await this.regionalConfigRepository.findByCountryId(countryId);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findByRegionId(regionId: number): Promise<RegionalConfigResponseDto[]> {
        const entities = await this.regionalConfigRepository.findByRegionId(regionId);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findByConfigKey(configKey: string): Promise<RegionalConfigResponseDto[]> {
        const entities = await this.regionalConfigRepository.findByConfigKey(configKey);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findByCountryAndConfigKey(countryId: number, configKey: string): Promise<RegionalConfigResponseDto | null> {
        const entity = await this.regionalConfigRepository.findByCountryAndConfigKey(countryId, configKey);
        if (!entity) {
            return null;
        }
        return this.mapToDto(entity);
    }

    async findByRegionAndConfigKey(regionId: number, configKey: string): Promise<RegionalConfigResponseDto | null> {
        const entity = await this.regionalConfigRepository.findByRegionAndConfigKey(regionId, configKey);
        if (!entity) {
            return null;
        }
        return this.mapToDto(entity);
    }

    async findActive(): Promise<RegionalConfigResponseDto[]> {
        const entities = await this.regionalConfigRepository.findActive();
        return entities.map((entity) => this.mapToDto(entity));
    }
}
