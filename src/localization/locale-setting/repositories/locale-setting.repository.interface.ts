export interface LocaleSettingEntity {
    id: number;
    locale_code: string;
    country_id?: number;
    date_format: string;
    time_format: string;
    currency_format: string;
    number_format: string;
    timezone?: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}

export interface ILocaleSettingRepository {
    findAll(): Promise<LocaleSettingEntity[]>;
    findById(id: number): Promise<LocaleSettingEntity | null>;
    findByLocaleCode(localeCode: string): Promise<LocaleSettingEntity | null>;
    findByCountryId(countryId: number): Promise<LocaleSettingEntity[]>;
    findActive(): Promise<LocaleSettingEntity[]>;
}
