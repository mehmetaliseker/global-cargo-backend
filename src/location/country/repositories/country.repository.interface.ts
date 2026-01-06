export interface CountryEntity {
  id: number;
  uuid: string;
  iso_code: string;
  iso_code_2: string;
  name: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface ICountryRepository {
  findAll(): Promise<CountryEntity[]>;
  findById(id: number): Promise<CountryEntity | null>;
  findByUuid(uuid: string): Promise<CountryEntity | null>;
  findByIsoCode(isoCode: string): Promise<CountryEntity | null>;
  findByIsoCode2(isoCode2: string): Promise<CountryEntity | null>;
  findActive(): Promise<CountryEntity[]>;
}

