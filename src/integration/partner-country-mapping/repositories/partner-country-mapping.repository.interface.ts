export interface PartnerCountryMappingEntity {
  id: number;
  partner_id: number;
  country_id: number;
  is_active: boolean;
  mapping_data?: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface IPartnerCountryMappingRepository {
  findAll(): Promise<PartnerCountryMappingEntity[]>;
  findById(id: number): Promise<PartnerCountryMappingEntity | null>;
  findByPartnerId(partnerId: number): Promise<PartnerCountryMappingEntity[]>;
  findByCountryId(countryId: number): Promise<PartnerCountryMappingEntity[]>;
  findByPartnerIdAndCountryId(
    partnerId: number,
    countryId: number,
  ): Promise<PartnerCountryMappingEntity | null>;
  findActive(): Promise<PartnerCountryMappingEntity[]>;
  findByPartnerIdActive(
    partnerId: number,
  ): Promise<PartnerCountryMappingEntity[]>;
  create(
    partnerId: number,
    countryId: number,
    isActive: boolean,
    mappingData: Record<string, unknown> | null,
  ): Promise<PartnerCountryMappingEntity>;
  update(
    id: number,
    isActive: boolean,
    mappingData: Record<string, unknown> | null,
  ): Promise<PartnerCountryMappingEntity>;
  softDelete(id: number): Promise<void>;
}

