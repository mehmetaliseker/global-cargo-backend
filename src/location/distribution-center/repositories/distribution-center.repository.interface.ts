export interface DistributionCenterEntity {
  id: number;
  uuid: string;
  country_id: number;
  city_id?: number;
  name: string;
  code?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  is_transfer_point: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface IDistributionCenterRepository {
  findAll(): Promise<DistributionCenterEntity[]>;
  findById(id: number): Promise<DistributionCenterEntity | null>;
  findByUuid(uuid: string): Promise<DistributionCenterEntity | null>;
  findByCountryId(countryId: number): Promise<DistributionCenterEntity[]>;
  findByCityId(cityId: number): Promise<DistributionCenterEntity[]>;
  findActive(): Promise<DistributionCenterEntity[]>;
  findByCountryIdAndActive(countryId: number): Promise<DistributionCenterEntity[]>;
  findTransferPoints(): Promise<DistributionCenterEntity[]>;
}

