export interface CustomsTaxCalculationEntity {
  id: number;
  cargo_id: number;
  country_id: number;
  shipment_type_id: number;
  customs_duty_amount: number;
  vat_amount: number;
  additional_tax_amount: number;
  total_tax_amount: number;
  currency_id: number;
  tax_regulation_version_id?: number;
  calculation_date: Date;
  country_risk_id?: number;
  risk_check_passed: boolean;
  created_at: Date;
}

export interface ICustomsTaxCalculationRepository {
  findAll(): Promise<CustomsTaxCalculationEntity[]>;
  findById(id: number): Promise<CustomsTaxCalculationEntity | null>;
  findByCargoId(cargoId: number): Promise<CustomsTaxCalculationEntity[]>;
  findByCargoIdLatest(cargoId: number): Promise<CustomsTaxCalculationEntity | null>;
  findByCountryId(countryId: number): Promise<CustomsTaxCalculationEntity[]>;
  findByCountryIdAndDateRange(
    countryId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<CustomsTaxCalculationEntity[]>;
  findByCalculationDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<CustomsTaxCalculationEntity[]>;
  findByRiskCheckPassed(
    riskCheckPassed: boolean,
  ): Promise<CustomsTaxCalculationEntity[]>;
  create(
    cargoId: number,
    countryId: number,
    shipmentTypeId: number,
    customsDutyAmount: number,
    vatAmount: number,
    additionalTaxAmount: number,
    totalTaxAmount: number,
    currencyId: number,
    taxRegulationVersionId: number | null,
    countryRiskId: number | null,
    riskCheckPassed: boolean,
  ): Promise<CustomsTaxCalculationEntity>;
}

