export interface DistrictEntity {
  id: number;
  uuid: string;
  city_id: number;
  name: string;
  code?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface IDistrictRepository {
  findAll(): Promise<DistrictEntity[]>;
  findById(id: number): Promise<DistrictEntity | null>;
  findByUuid(uuid: string): Promise<DistrictEntity | null>;
  findByCityId(cityId: number): Promise<DistrictEntity[]>;
  findActive(): Promise<DistrictEntity[]>;
  findByCityIdAndActive(cityId: number): Promise<DistrictEntity[]>;
}

