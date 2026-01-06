export interface PartnerEntity {
  id: number;
  uuid: string;
  actor_id: number;
  company_name: string;
  tax_number?: string;
  country_id?: number;
  api_active: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface IPartnerRepository {
  findAll(): Promise<PartnerEntity[]>;
  findById(id: number): Promise<PartnerEntity | null>;
  findByUuid(uuid: string): Promise<PartnerEntity | null>;
  findByActorId(actorId: number): Promise<PartnerEntity | null>;
  findByCountryId(countryId: number): Promise<PartnerEntity[]>;
  findActive(): Promise<PartnerEntity[]>;
  findApiActive(): Promise<PartnerEntity[]>;
  findByCountryIdAndActive(countryId: number): Promise<PartnerEntity[]>;
}

