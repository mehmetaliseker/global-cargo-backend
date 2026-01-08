export interface RegionalConfigEntity {
    id: number;
    country_id?: number;
    region_id?: number;
    config_key: string;
    config_value: any;
    description?: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}

export interface IRegionalConfigRepository {
    findAll(): Promise<RegionalConfigEntity[]>;
    findById(id: number): Promise<RegionalConfigEntity | null>;
    findByCountryId(countryId: number): Promise<RegionalConfigEntity[]>;
    findByRegionId(regionId: number): Promise<RegionalConfigEntity[]>;
    findByConfigKey(configKey: string): Promise<RegionalConfigEntity[]>;
    findByCountryAndConfigKey(countryId: number, configKey: string): Promise<RegionalConfigEntity | null>;
    findByRegionAndConfigKey(regionId: number, configKey: string): Promise<RegionalConfigEntity | null>;
    findActive(): Promise<RegionalConfigEntity[]>;
}
