export interface CityEntity {
  id: number;
  uuid: string;
  region_id: number;
  name: string;
  code?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface ICityRepository {
  findAll(): Promise<CityEntity[]>;
  findById(id: number): Promise<CityEntity | null>;
  findByUuid(uuid: string): Promise<CityEntity | null>;
  findByRegionId(regionId: number): Promise<CityEntity[]>;
  findActive(): Promise<CityEntity[]>;
  findByRegionIdAndActive(regionId: number): Promise<CityEntity[]>;
}

