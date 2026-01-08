import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  LoyaltyProgramEntity,
  ILoyaltyProgramRepository,
  CustomerLoyaltyPointsEntity,
  ICustomerLoyaltyPointsRepository,
  CustomerCreditLimitEntity,
  ICustomerCreditLimitRepository,
} from './customer-profile.repository.interface';

@Injectable()
export class LoyaltyProgramRepository implements ILoyaltyProgramRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<LoyaltyProgramEntity[]> {
    const query = `
      SELECT id, uuid, program_name, description, point_conversion_rate,
             tier_levels, is_active, created_at, updated_at, deleted_at
      FROM loyalty_program
      WHERE deleted_at IS NULL
      ORDER BY program_name ASC
    `;
    return await this.databaseService.query<LoyaltyProgramEntity>(query);
  }

  async findById(id: number): Promise<LoyaltyProgramEntity | null> {
    const query = `
      SELECT id, uuid, program_name, description, point_conversion_rate,
             tier_levels, is_active, created_at, updated_at, deleted_at
      FROM loyalty_program
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<LoyaltyProgramEntity>(query, [
      id,
    ]);
  }

  async findByUuid(uuid: string): Promise<LoyaltyProgramEntity | null> {
    const query = `
      SELECT id, uuid, program_name, description, point_conversion_rate,
             tier_levels, is_active, created_at, updated_at, deleted_at
      FROM loyalty_program
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<LoyaltyProgramEntity>(query, [
      uuid,
    ]);
  }

  async findActive(): Promise<LoyaltyProgramEntity[]> {
    const query = `
      SELECT id, uuid, program_name, description, point_conversion_rate,
             tier_levels, is_active, created_at, updated_at, deleted_at
      FROM loyalty_program
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY program_name ASC
    `;
    return await this.databaseService.query<LoyaltyProgramEntity>(query);
  }
}

@Injectable()
export class CustomerLoyaltyPointsRepository
  implements ICustomerLoyaltyPointsRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<CustomerLoyaltyPointsEntity[]> {
    const query = `
      SELECT id, customer_id, loyalty_program_id, total_points, available_points,
             expired_points, current_tier, last_updated_at, created_at, updated_at
      FROM customer_loyalty_points
      ORDER BY total_points DESC
    `;
    return await this.databaseService.query<CustomerLoyaltyPointsEntity>(
      query,
    );
  }

  async findById(id: number): Promise<CustomerLoyaltyPointsEntity | null> {
    const query = `
      SELECT id, customer_id, loyalty_program_id, total_points, available_points,
             expired_points, current_tier, last_updated_at, created_at, updated_at
      FROM customer_loyalty_points
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<CustomerLoyaltyPointsEntity>(
      query,
      [id],
    );
  }

  async findByCustomerId(
    customerId: number,
  ): Promise<CustomerLoyaltyPointsEntity | null> {
    const query = `
      SELECT id, customer_id, loyalty_program_id, total_points, available_points,
             expired_points, current_tier, last_updated_at, created_at, updated_at
      FROM customer_loyalty_points
      WHERE customer_id = $1
    `;
    return await this.databaseService.queryOne<CustomerLoyaltyPointsEntity>(
      query,
      [customerId],
    );
  }

  async findByLoyaltyProgramId(
    loyaltyProgramId: number,
  ): Promise<CustomerLoyaltyPointsEntity[]> {
    const query = `
      SELECT id, customer_id, loyalty_program_id, total_points, available_points,
             expired_points, current_tier, last_updated_at, created_at, updated_at
      FROM customer_loyalty_points
      WHERE loyalty_program_id = $1
      ORDER BY total_points DESC
    `;
    return await this.databaseService.query<CustomerLoyaltyPointsEntity>(
      query,
      [loyaltyProgramId],
    );
  }
}

@Injectable()
export class CustomerCreditLimitRepository
  implements ICustomerCreditLimitRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<CustomerCreditLimitEntity[]> {
    const query = `
      SELECT id, customer_id, credit_limit_amount, used_amount, available_amount,
             currency_id, last_updated_at, created_at, updated_at
      FROM customer_credit_limit
      ORDER BY credit_limit_amount DESC
    `;
    return await this.databaseService.query<CustomerCreditLimitEntity>(query);
  }

  async findById(id: number): Promise<CustomerCreditLimitEntity | null> {
    const query = `
      SELECT id, customer_id, credit_limit_amount, used_amount, available_amount,
             currency_id, last_updated_at, created_at, updated_at
      FROM customer_credit_limit
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<CustomerCreditLimitEntity>(
      query,
      [id],
    );
  }

  async findByCustomerId(
    customerId: number,
  ): Promise<CustomerCreditLimitEntity | null> {
    const query = `
      SELECT id, customer_id, credit_limit_amount, used_amount, available_amount,
             currency_id, last_updated_at, created_at, updated_at
      FROM customer_credit_limit
      WHERE customer_id = $1
    `;
    return await this.databaseService.queryOne<CustomerCreditLimitEntity>(
      query,
      [customerId],
    );
  }
}
