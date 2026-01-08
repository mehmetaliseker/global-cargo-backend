import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
    LocaleSettingEntity,
    ILocaleSettingRepository,
} from './locale-setting.repository.interface';

@Injectable()
export class LocaleSettingRepository implements ILocaleSettingRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findAll(): Promise<LocaleSettingEntity[]> {
        const query = `
      SELECT id, locale_code, country_id, date_format, time_format,
             currency_format, number_format, timezone, is_active,
             created_at, updated_at, deleted_at
      FROM locale_setting
      WHERE deleted_at IS NULL
      ORDER BY locale_code ASC
    `;
        return await this.databaseService.query<LocaleSettingEntity>(query);
    }

    async findById(id: number): Promise<LocaleSettingEntity | null> {
        const query = `
      SELECT id, locale_code, country_id, date_format, time_format,
             currency_format, number_format, timezone, is_active,
             created_at, updated_at, deleted_at
      FROM locale_setting
      WHERE id = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<LocaleSettingEntity>(query, [id]);
    }

    async findByLocaleCode(localeCode: string): Promise<LocaleSettingEntity | null> {
        const query = `
      SELECT id, locale_code, country_id, date_format, time_format,
             currency_format, number_format, timezone, is_active,
             created_at, updated_at, deleted_at
      FROM locale_setting
      WHERE locale_code = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<LocaleSettingEntity>(query, [localeCode]);
    }

    async findByCountryId(countryId: number): Promise<LocaleSettingEntity[]> {
        const query = `
      SELECT id, locale_code, country_id, date_format, time_format,
             currency_format, number_format, timezone, is_active,
             created_at, updated_at, deleted_at
      FROM locale_setting
      WHERE country_id = $1 AND deleted_at IS NULL
      ORDER BY locale_code ASC
    `;
        return await this.databaseService.query<LocaleSettingEntity>(query, [countryId]);
    }

    async findActive(): Promise<LocaleSettingEntity[]> {
        const query = `
      SELECT id, locale_code, country_id, date_format, time_format,
             currency_format, number_format, timezone, is_active,
             created_at, updated_at, deleted_at
      FROM locale_setting
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY locale_code ASC
    `;
        return await this.databaseService.query<LocaleSettingEntity>(query);
    }
}
