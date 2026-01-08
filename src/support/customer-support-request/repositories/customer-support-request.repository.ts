import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DatabaseService } from '../../../database/database.service';
import {
  CustomerSupportRequestEntity,
  ICustomerSupportRequestRepository,
} from './customer-support-request.repository.interface';

@Injectable()
export class CustomerSupportRequestRepository
  implements ICustomerSupportRequestRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<CustomerSupportRequestEntity[]> {
    const query = `
      SELECT id, uuid, customer_id, cargo_id, request_type, subject, description,
             priority, status, assigned_to, requested_date, resolved_date,
             created_at, updated_at, deleted_at
      FROM customer_support_request
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CustomerSupportRequestEntity>(
      query,
    );
  }

  async findById(id: number): Promise<CustomerSupportRequestEntity | null> {
    const query = `
      SELECT id, uuid, customer_id, cargo_id, request_type, subject, description,
             priority, status, assigned_to, requested_date, resolved_date,
             created_at, updated_at, deleted_at
      FROM customer_support_request
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CustomerSupportRequestEntity>(
      query,
      [id],
    );
  }

  async findByUuid(
    uuid: string,
  ): Promise<CustomerSupportRequestEntity | null> {
    const query = `
      SELECT id, uuid, customer_id, cargo_id, request_type, subject, description,
             priority, status, assigned_to, requested_date, resolved_date,
             created_at, updated_at, deleted_at
      FROM customer_support_request
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CustomerSupportRequestEntity>(
      query,
      [uuid],
    );
  }

  async findByCustomerId(
    customerId: number,
  ): Promise<CustomerSupportRequestEntity[]> {
    const query = `
      SELECT id, uuid, customer_id, cargo_id, request_type, subject, description,
             priority, status, assigned_to, requested_date, resolved_date,
             created_at, updated_at, deleted_at
      FROM customer_support_request
      WHERE customer_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CustomerSupportRequestEntity>(
      query,
      [customerId],
    );
  }

  async findByCargoId(
    cargoId: number,
  ): Promise<CustomerSupportRequestEntity[]> {
    const query = `
      SELECT id, uuid, customer_id, cargo_id, request_type, subject, description,
             priority, status, assigned_to, requested_date, resolved_date,
             created_at, updated_at, deleted_at
      FROM customer_support_request
      WHERE cargo_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CustomerSupportRequestEntity>(
      query,
      [cargoId],
    );
  }

  async findByStatus(
    status: string,
  ): Promise<CustomerSupportRequestEntity[]> {
    const query = `
      SELECT id, uuid, customer_id, cargo_id, request_type, subject, description,
             priority, status, assigned_to, requested_date, resolved_date,
             created_at, updated_at, deleted_at
      FROM customer_support_request
      WHERE status = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CustomerSupportRequestEntity>(
      query,
      [status],
    );
  }

  async findByPriority(
    priority: string,
  ): Promise<CustomerSupportRequestEntity[]> {
    const query = `
      SELECT id, uuid, customer_id, cargo_id, request_type, subject, description,
             priority, status, assigned_to, requested_date, resolved_date,
             created_at, updated_at, deleted_at
      FROM customer_support_request
      WHERE priority = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CustomerSupportRequestEntity>(
      query,
      [priority],
    );
  }

  async findByAssignedTo(
    employeeId: number,
  ): Promise<CustomerSupportRequestEntity[]> {
    const query = `
      SELECT id, uuid, customer_id, cargo_id, request_type, subject, description,
             priority, status, assigned_to, requested_date, resolved_date,
             created_at, updated_at, deleted_at
      FROM customer_support_request
      WHERE assigned_to = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CustomerSupportRequestEntity>(
      query,
      [employeeId],
    );
  }

  async findByCustomerIdAndStatus(
    customerId: number,
    status: string,
  ): Promise<CustomerSupportRequestEntity[]> {
    const query = `
      SELECT id, uuid, customer_id, cargo_id, request_type, subject, description,
             priority, status, assigned_to, requested_date, resolved_date,
             created_at, updated_at, deleted_at
      FROM customer_support_request
      WHERE customer_id = $1 AND status = $2 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CustomerSupportRequestEntity>(
      query,
      [customerId, status],
    );
  }

  async create(
    customerId: number,
    cargoId: number | null,
    requestType: string,
    subject: string | null,
    description: string,
    priority: string,
    status: string,
    assignedTo: number | null,
  ): Promise<CustomerSupportRequestEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient) => {
        // Migration 014: Unique constraint on cargo_id (when not NULL)
        // Check if an active support request already exists for this cargo
        if (cargoId !== null) {
          const checkQuery = `
            SELECT id FROM customer_support_request
            WHERE cargo_id = $1 AND deleted_at IS NULL
            LIMIT 1
          `;
          const existing = await client.query(checkQuery, [cargoId]);
          if (existing.rows.length > 0) {
            throw new Error(
              `An active support request already exists for cargo ${cargoId}`,
            );
          }
        }

        const insertQuery = `
          INSERT INTO customer_support_request (
            customer_id, cargo_id, request_type, subject, description,
            priority, status, assigned_to
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING id, uuid, customer_id, cargo_id, request_type, subject, description,
                    priority, status, assigned_to, requested_date, resolved_date,
                    created_at, updated_at, deleted_at
        `;
        const result =
          await client.query<CustomerSupportRequestEntity>(insertQuery, [
            customerId,
            cargoId,
            requestType,
            subject,
            description,
            priority,
            status,
            assignedTo,
          ]);
        return result.rows[0];
      },
    );
  }

  async update(
    id: number,
    requestType: string | null,
    subject: string | null,
    description: string | null,
    priority: string | null,
    status: string | null,
    assignedTo: number | null,
    resolvedDate: Date | null,
  ): Promise<CustomerSupportRequestEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient) => {
        const updateQuery = `
          UPDATE customer_support_request
          SET request_type = COALESCE($2, request_type),
              subject = COALESCE($3, subject),
              description = COALESCE($4, description),
              priority = COALESCE($5, priority),
              status = COALESCE($6, status),
              assigned_to = COALESCE($7, assigned_to),
              resolved_date = COALESCE($8, resolved_date),
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1 AND deleted_at IS NULL
          RETURNING id, uuid, customer_id, cargo_id, request_type, subject, description,
                    priority, status, assigned_to, requested_date, resolved_date,
                    created_at, updated_at, deleted_at
        `;
        const result =
          await client.query<CustomerSupportRequestEntity>(updateQuery, [
            id,
            requestType,
            subject,
            description,
            priority,
            status,
            assignedTo,
            resolvedDate,
          ]);
        if (result.rows.length === 0) {
          throw new Error(
            `Customer support request with id ${id} not found`,
          );
        }
        return result.rows[0];
      },
    );
  }

  async softDelete(id: number): Promise<void> {
    await this.databaseService.transaction(async (client: PoolClient) => {
      const updateQuery = `
        UPDATE customer_support_request
        SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND deleted_at IS NULL
      `;
      const result = await client.query(updateQuery, [id]);
      if (result.rowCount === 0) {
        throw new Error(
          `Customer support request with id ${id} not found`,
        );
      }
    });
  }
}

