export interface RegionEntity {
  id: number;
  uuid: string;
  country_id: number;
  name: string;
  code?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface IRegionRepository {
  findAll(): Promise<RegionEntity[]>;
  findById(id: number): Promise<RegionEntity | null>;
  findByUuid(uuid: string): Promise<RegionEntity | null>;
  findByCountryId(countryId: number): Promise<RegionEntity[]>;
  findActive(): Promise<RegionEntity[]>;
  findByCountryIdAndActive(countryId: number): Promise<RegionEntity[]>;
}

