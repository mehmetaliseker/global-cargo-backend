import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DatabaseService } from '../../../database/database.service';
import {
  CargoInsuranceEntity,
  ICargoInsuranceRepository,
} from './cargo-insurance.repository.interface';

@Injectable()
export class CargoInsuranceRepository
  implements ICargoInsuranceRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<CargoInsuranceEntity[]> {
    const query = `
      SELECT id, cargo_id, insurance_policy_number, insured_value, premium_amount,
             currency_id, coverage_type, policy_data, issue_date, expiry_date,
             is_active, created_at
      FROM cargo_insurance
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CargoInsuranceEntity>(query);
  }

  async findById(id: number): Promise<CargoInsuranceEntity | null> {
    const query = `
      SELECT id, cargo_id, insurance_policy_number, insured_value, premium_amount,
             currency_id, coverage_type, policy_data, issue_date, expiry_date,
             is_active, created_at
      FROM cargo_insurance
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<CargoInsuranceEntity>(
      query,
      [id],
    );
  }

  async findByCargoId(cargoId: number): Promise<CargoInsuranceEntity | null> {
    const query = `
      SELECT id, cargo_id, insurance_policy_number, insured_value, premium_amount,
             currency_id, coverage_type, policy_data, issue_date, expiry_date,
             is_active, created_at
      FROM cargo_insurance
      WHERE cargo_id = $1
    `;
    return await this.databaseService.queryOne<CargoInsuranceEntity>(
      query,
      [cargoId],
    );
  }

  async findByPolicyNumber(
    policyNumber: string,
  ): Promise<CargoInsuranceEntity | null> {
    const query = `
      SELECT id, cargo_id, insurance_policy_number, insured_value, premium_amount,
             currency_id, coverage_type, policy_data, issue_date, expiry_date,
             is_active, created_at
      FROM cargo_insurance
      WHERE insurance_policy_number = $1
    `;
    return await this.databaseService.queryOne<CargoInsuranceEntity>(
      query,
      [policyNumber],
    );
  }

  async findActive(): Promise<CargoInsuranceEntity[]> {
    const query = `
      SELECT id, cargo_id, insurance_policy_number, insured_value, premium_amount,
             currency_id, coverage_type, policy_data, issue_date, expiry_date,
             is_active, created_at
      FROM cargo_insurance
      WHERE is_active = true
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CargoInsuranceEntity>(query);
  }

  async findByActiveStatus(
    isActive: boolean,
  ): Promise<CargoInsuranceEntity[]> {
    const query = `
      SELECT id, cargo_id, insurance_policy_number, insured_value, premium_amount,
             currency_id, coverage_type, policy_data, issue_date, expiry_date,
             is_active, created_at
      FROM cargo_insurance
      WHERE is_active = $1
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CargoInsuranceEntity>(query, [
      isActive,
    ]);
  }

  async create(
    cargoId: number,
    insurancePolicyNumber: string,
    insuredValue: number,
    premiumAmount: number,
    currencyId: number,
    coverageType: string | null,
    policyData: Record<string, unknown> | null,
    issueDate: Date,
    expiryDate: Date | null,
  ): Promise<CargoInsuranceEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient): Promise<CargoInsuranceEntity> => {
        const insertQuery = `
          INSERT INTO cargo_insurance 
            (cargo_id, insurance_policy_number, insured_value, premium_amount,
             currency_id, coverage_type, policy_data, issue_date, expiry_date, is_active)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
          RETURNING id, cargo_id, insurance_policy_number, insured_value, premium_amount,
                    currency_id, coverage_type, policy_data, issue_date, expiry_date,
                    is_active, created_at
        `;
        const result = await client.query<CargoInsuranceEntity>(
          insertQuery,
          [
            cargoId,
            insurancePolicyNumber,
            insuredValue,
            premiumAmount,
            currencyId,
            coverageType,
            policyData ? JSON.stringify(policyData) : null,
            issueDate,
            expiryDate,
          ],
        );
        return result.rows[0];
      },
    );
  }

  // Migration 014: UPDATE operation disabled via database trigger
  // update method removed - cargo_insurance records are immutable
}

