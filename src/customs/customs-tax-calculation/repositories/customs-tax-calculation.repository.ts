import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DatabaseService } from '../../../database/database.service';
import {
  CustomsTaxCalculationEntity,
  ICustomsTaxCalculationRepository,
} from './customs-tax-calculation.repository.interface';

@Injectable()
export class CustomsTaxCalculationRepository
  implements ICustomsTaxCalculationRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<CustomsTaxCalculationEntity[]> {
    const query = `
      SELECT id, cargo_id, country_id, shipment_type_id, customs_duty_amount, vat_amount,
             additional_tax_amount, total_tax_amount, currency_id, tax_regulation_version_id,
             calculation_date, country_risk_id, risk_check_passed, created_at
      FROM customs_tax_calculation
      ORDER BY calculation_date DESC
    `;
    return await this.databaseService.query<CustomsTaxCalculationEntity>(
      query,
    );
  }

  async findById(id: number): Promise<CustomsTaxCalculationEntity | null> {
    const query = `
      SELECT id, cargo_id, country_id, shipment_type_id, customs_duty_amount, vat_amount,
             additional_tax_amount, total_tax_amount, currency_id, tax_regulation_version_id,
             calculation_date, country_risk_id, risk_check_passed, created_at
      FROM customs_tax_calculation
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<CustomsTaxCalculationEntity>(
      query,
      [id],
    );
  }

  async findByCargoId(
    cargoId: number,
  ): Promise<CustomsTaxCalculationEntity[]> {
    const query = `
      SELECT id, cargo_id, country_id, shipment_type_id, customs_duty_amount, vat_amount,
             additional_tax_amount, total_tax_amount, currency_id, tax_regulation_version_id,
             calculation_date, country_risk_id, risk_check_passed, created_at
      FROM customs_tax_calculation
      WHERE cargo_id = $1
      ORDER BY calculation_date DESC
    `;
    return await this.databaseService.query<CustomsTaxCalculationEntity>(
      query,
      [cargoId],
    );
  }

  async findByCargoIdLatest(
    cargoId: number,
  ): Promise<CustomsTaxCalculationEntity | null> {
    const query = `
      SELECT id, cargo_id, country_id, shipment_type_id, customs_duty_amount, vat_amount,
             additional_tax_amount, total_tax_amount, currency_id, tax_regulation_version_id,
             calculation_date, country_risk_id, risk_check_passed, created_at
      FROM customs_tax_calculation
      WHERE cargo_id = $1
      ORDER BY calculation_date DESC
      LIMIT 1
    `;
    return await this.databaseService.queryOne<CustomsTaxCalculationEntity>(
      query,
      [cargoId],
    );
  }

  async findByCountryId(
    countryId: number,
  ): Promise<CustomsTaxCalculationEntity[]> {
    const query = `
      SELECT id, cargo_id, country_id, shipment_type_id, customs_duty_amount, vat_amount,
             additional_tax_amount, total_tax_amount, currency_id, tax_regulation_version_id,
             calculation_date, country_risk_id, risk_check_passed, created_at
      FROM customs_tax_calculation
      WHERE country_id = $1
      ORDER BY calculation_date DESC
    `;
    return await this.databaseService.query<CustomsTaxCalculationEntity>(
      query,
      [countryId],
    );
  }

  async findByCountryIdAndDateRange(
    countryId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<CustomsTaxCalculationEntity[]> {
    const query = `
      SELECT id, cargo_id, country_id, shipment_type_id, customs_duty_amount, vat_amount,
             additional_tax_amount, total_tax_amount, currency_id, tax_regulation_version_id,
             calculation_date, country_risk_id, risk_check_passed, created_at
      FROM customs_tax_calculation
      WHERE country_id = $1 
        AND calculation_date >= $2 
        AND calculation_date <= $3
      ORDER BY calculation_date DESC
    `;
    return await this.databaseService.query<CustomsTaxCalculationEntity>(
      query,
      [countryId, startDate, endDate],
    );
  }

  async findByCalculationDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<CustomsTaxCalculationEntity[]> {
    const query = `
      SELECT id, cargo_id, country_id, shipment_type_id, customs_duty_amount, vat_amount,
             additional_tax_amount, total_tax_amount, currency_id, tax_regulation_version_id,
             calculation_date, country_risk_id, risk_check_passed, created_at
      FROM customs_tax_calculation
      WHERE calculation_date >= $1 AND calculation_date <= $2
      ORDER BY calculation_date DESC
    `;
    return await this.databaseService.query<CustomsTaxCalculationEntity>(
      query,
      [startDate, endDate],
    );
  }

  async findByRiskCheckPassed(
    riskCheckPassed: boolean,
  ): Promise<CustomsTaxCalculationEntity[]> {
    const query = `
      SELECT id, cargo_id, country_id, shipment_type_id, customs_duty_amount, vat_amount,
             additional_tax_amount, total_tax_amount, currency_id, tax_regulation_version_id,
             calculation_date, country_risk_id, risk_check_passed, created_at
      FROM customs_tax_calculation
      WHERE risk_check_passed = $1
      ORDER BY calculation_date DESC
    `;
    return await this.databaseService.query<CustomsTaxCalculationEntity>(
      query,
      [riskCheckPassed],
    );
  }

  async create(
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
  ): Promise<CustomsTaxCalculationEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient): Promise<CustomsTaxCalculationEntity> => {
        const insertQuery = `
          INSERT INTO customs_tax_calculation 
            (cargo_id, country_id, shipment_type_id, customs_duty_amount, vat_amount,
             additional_tax_amount, total_tax_amount, currency_id, tax_regulation_version_id,
             calculation_date, country_risk_id, risk_check_passed)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, $10, $11)
          RETURNING id, cargo_id, country_id, shipment_type_id, customs_duty_amount, vat_amount,
                    additional_tax_amount, total_tax_amount, currency_id, tax_regulation_version_id,
                    calculation_date, country_risk_id, risk_check_passed, created_at
        `;
        const result = await client.query<CustomsTaxCalculationEntity>(
          insertQuery,
          [
            cargoId,
            countryId,
            shipmentTypeId,
            customsDutyAmount,
            vatAmount,
            additionalTaxAmount,
            totalTaxAmount,
            currencyId,
            taxRegulationVersionId,
            countryRiskId,
            riskCheckPassed,
          ],
        );
        return result.rows[0];
      },
    );
  }
}

