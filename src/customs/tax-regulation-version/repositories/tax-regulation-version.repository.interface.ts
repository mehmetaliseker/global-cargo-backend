export interface TaxRegulationVersionEntity {
  id: number;
  country_id: number;
  year: number;
  regulation_data: Record<string, unknown>;
  effective_from: Date;
  effective_to?: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface ITaxRegulationVersionRepository {
  findAll(): Promise<TaxRegulationVersionEntity[]>;
  findById(id: number): Promise<TaxRegulationVersionEntity | null>;
  findByCountryId(countryId: number): Promise<TaxRegulationVersionEntity[]>;
  findByCountryIdAndYear(
    countryId: number,
    year: number,
  ): Promise<TaxRegulationVersionEntity | null>;
  findActiveByCountryId(
    countryId: number,
  ): Promise<TaxRegulationVersionEntity[]>;
  findActiveByCountryIdAndDate(
    countryId: number,
    date: Date,
  ): Promise<TaxRegulationVersionEntity | null>;
  create(
    countryId: number,
    year: number,
    regulationData: Record<string, unknown>,
    effectiveFrom: Date,
    effectiveTo: Date | null,
  ): Promise<TaxRegulationVersionEntity>;
  update(
    id: number,
    regulationData: Record<string, unknown>,
    effectiveFrom: Date,
    effectiveTo: Date | null,
    isActive: boolean,
  ): Promise<TaxRegulationVersionEntity>;
  softDelete(id: number): Promise<void>;
}

