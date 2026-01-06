export interface CountryRiskEntity {
  id: number;
  country_id: number;
  risk_level: string;
  risk_score: number;
  updated_at: Date;
  deleted_at?: Date;
}

export interface ICountryRiskRepository {
  findAll(): Promise<CountryRiskEntity[]>;
  findById(id: number): Promise<CountryRiskEntity | null>;
  findByCountryId(countryId: number): Promise<CountryRiskEntity | null>;
}

