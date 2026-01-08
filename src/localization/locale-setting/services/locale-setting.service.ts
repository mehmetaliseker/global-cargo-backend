import { Injectable, NotFoundException } from '@nestjs/common';
import { LocaleSettingRepository } from '../repositories/locale-setting.repository';
import { LocaleSettingResponseDto } from '../dto/locale-setting.dto';
import { LocaleSettingEntity } from '../repositories/locale-setting.repository.interface';

@Injectable()
export class LocaleSettingService {
    constructor(
        private readonly localeSettingRepository: LocaleSettingRepository,
    ) { }

    private mapToDto(entity: LocaleSettingEntity): LocaleSettingResponseDto {
        return {
            id: entity.id,
            localeCode: entity.locale_code,
            countryId: entity.country_id ?? undefined,
            dateFormat: entity.date_format,
            timeFormat: entity.time_format,
            currencyFormat: entity.currency_format,
            numberFormat: entity.number_format,
            timezone: entity.timezone ?? undefined,
            isActive: entity.is_active,
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString(),
        };
    }

    async findAll(): Promise<LocaleSettingResponseDto[]> {
        const entities = await this.localeSettingRepository.findAll();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findById(id: number): Promise<LocaleSettingResponseDto> {
        const entity = await this.localeSettingRepository.findById(id);
        if (!entity) {
            throw new NotFoundException(`Locale setting with id ${id} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByLocaleCode(localeCode: string): Promise<LocaleSettingResponseDto | null> {
        const entity = await this.localeSettingRepository.findByLocaleCode(localeCode);
        if (!entity) {
            return null;
        }
        return this.mapToDto(entity);
    }

    async findByCountryId(countryId: number): Promise<LocaleSettingResponseDto[]> {
        const entities = await this.localeSettingRepository.findByCountryId(countryId);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findActive(): Promise<LocaleSettingResponseDto[]> {
        const entities = await this.localeSettingRepository.findActive();
        return entities.map((entity) => this.mapToDto(entity));
    }
}
