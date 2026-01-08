export interface CustomsDocumentTypeEntity {
  id: number;
  code: string;
  name: string;
  description?: string;
  required_fields?: Record<string, unknown>;
  country_specific: boolean;
  country_id?: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface ICustomsDocumentTypeRepository {
  findAll(): Promise<CustomsDocumentTypeEntity[]>;
  findById(id: number): Promise<CustomsDocumentTypeEntity | null>;
  findByCode(code: string): Promise<CustomsDocumentTypeEntity | null>;
  findByCountryId(countryId: number): Promise<CustomsDocumentTypeEntity[]>;
  findActive(): Promise<CustomsDocumentTypeEntity[]>;
  findActiveByCountryId(
    countryId: number,
  ): Promise<CustomsDocumentTypeEntity[]>;
  create(
    code: string,
    name: string,
    description: string | null,
    requiredFields: Record<string, unknown> | null,
    countrySpecific: boolean,
    countryId: number | null,
  ): Promise<CustomsDocumentTypeEntity>;
  update(
    id: number,
    name: string,
    description: string | null,
    requiredFields: Record<string, unknown> | null,
    isActive: boolean,
  ): Promise<CustomsDocumentTypeEntity>;
  softDelete(id: number): Promise<void>;
}

