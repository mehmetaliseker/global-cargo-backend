import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  CustomerEntity,
  ICustomerRepository,
} from './customer.repository.interface';

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<CustomerEntity[]> {
    const query = `
      SELECT id, uuid, actor_id, first_name, last_name, identity_number, encrypted_identity_number, country_id, registration_date, is_verified, created_at, updated_at, deleted_at
      FROM customer
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CustomerEntity>(query);
  }

  async findById(id: number): Promise<CustomerEntity | null> {
    const query = `
      SELECT id, uuid, actor_id, first_name, last_name, identity_number, encrypted_identity_number, country_id, registration_date, is_verified, created_at, updated_at, deleted_at
      FROM customer
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CustomerEntity>(query, [id]);
  }

  async findByUuid(uuid: string): Promise<CustomerEntity | null> {
    const query = `
      SELECT id, uuid, actor_id, first_name, last_name, identity_number, encrypted_identity_number, country_id, registration_date, is_verified, created_at, updated_at, deleted_at
      FROM customer
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CustomerEntity>(query, [uuid]);
  }

  async findByActorId(actorId: number): Promise<CustomerEntity | null> {
    const query = `
      SELECT id, uuid, actor_id, first_name, last_name, identity_number, encrypted_identity_number, country_id, registration_date, is_verified, created_at, updated_at, deleted_at
      FROM customer
      WHERE actor_id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CustomerEntity>(query, [
      actorId,
    ]);
  }

  async findByCountryId(countryId: number): Promise<CustomerEntity[]> {
    const query = `
      SELECT id, uuid, actor_id, first_name, last_name, identity_number, encrypted_identity_number, country_id, registration_date, is_verified, created_at, updated_at, deleted_at
      FROM customer
      WHERE country_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CustomerEntity>(query, [countryId]);
  }

  async findVerified(): Promise<CustomerEntity[]> {
    const query = `
      SELECT id, uuid, actor_id, first_name, last_name, identity_number, encrypted_identity_number, country_id, registration_date, is_verified, created_at, updated_at, deleted_at
      FROM customer
      WHERE is_verified = true AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CustomerEntity>(query);
  }

  async findByCountryIdAndVerified(
    countryId: number,
  ): Promise<CustomerEntity[]> {
    const query = `
      SELECT id, uuid, actor_id, first_name, last_name, identity_number, encrypted_identity_number, country_id, registration_date, is_verified, created_at, updated_at, deleted_at
      FROM customer
      WHERE country_id = $1 AND is_verified = true AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CustomerEntity>(query, [countryId]);
  }
}

