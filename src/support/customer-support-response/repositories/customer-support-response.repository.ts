import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DatabaseService } from '../../../database/database.service';
import {
  CustomerSupportResponseEntity,
  ICustomerSupportResponseRepository,
} from './customer-support-response.repository.interface';

@Injectable()
export class CustomerSupportResponseRepository
  implements ICustomerSupportResponseRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<CustomerSupportResponseEntity[]> {
    const query = `
      SELECT id, support_request_id, employee_id, response_content, is_resolution,
             response_date, created_at, updated_at, deleted_at
      FROM customer_support_response
      WHERE deleted_at IS NULL
      ORDER BY response_date ASC
    `;
    return await this.databaseService.query<CustomerSupportResponseEntity>(
      query,
    );
  }

  async findById(id: number): Promise<CustomerSupportResponseEntity | null> {
    const query = `
      SELECT id, support_request_id, employee_id, response_content, is_resolution,
             response_date, created_at, updated_at, deleted_at
      FROM customer_support_response
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CustomerSupportResponseEntity>(
      query,
      [id],
    );
  }

  async findBySupportRequestId(
    supportRequestId: number,
  ): Promise<CustomerSupportResponseEntity[]> {
    const query = `
      SELECT id, support_request_id, employee_id, response_content, is_resolution,
             response_date, created_at, updated_at, deleted_at
      FROM customer_support_response
      WHERE support_request_id = $1 AND deleted_at IS NULL
      ORDER BY response_date ASC
    `;
    return await this.databaseService.query<CustomerSupportResponseEntity>(
      query,
      [supportRequestId],
    );
  }

  async findByEmployeeId(
    employeeId: number,
  ): Promise<CustomerSupportResponseEntity[]> {
    const query = `
      SELECT id, support_request_id, employee_id, response_content, is_resolution,
             response_date, created_at, updated_at, deleted_at
      FROM customer_support_response
      WHERE employee_id = $1 AND deleted_at IS NULL
      ORDER BY response_date DESC
    `;
    return await this.databaseService.query<CustomerSupportResponseEntity>(
      query,
      [employeeId],
    );
  }

  async findResolutions(
    supportRequestId: number,
  ): Promise<CustomerSupportResponseEntity[]> {
    const query = `
      SELECT id, support_request_id, employee_id, response_content, is_resolution,
             response_date, created_at, updated_at, deleted_at
      FROM customer_support_response
      WHERE support_request_id = $1 AND is_resolution = true AND deleted_at IS NULL
      ORDER BY response_date DESC
    `;
    return await this.databaseService.query<CustomerSupportResponseEntity>(
      query,
      [supportRequestId],
    );
  }

  async create(
    supportRequestId: number,
    employeeId: number | null,
    responseContent: string,
    isResolution: boolean,
  ): Promise<CustomerSupportResponseEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient) => {
        const insertQuery = `
          INSERT INTO customer_support_response (
            support_request_id, employee_id, response_content, is_resolution
          )
          VALUES ($1, $2, $3, $4)
          RETURNING id, support_request_id, employee_id, response_content, is_resolution,
                    response_date, created_at, updated_at, deleted_at
        `;
        const result =
          await client.query<CustomerSupportResponseEntity>(insertQuery, [
            supportRequestId,
            employeeId,
            responseContent,
            isResolution,
          ]);
        return result.rows[0];
      },
    );
  }

  async softDelete(id: number): Promise<void> {
    await this.databaseService.transaction(async (client: PoolClient) => {
      const updateQuery = `
        UPDATE customer_support_response
        SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND deleted_at IS NULL
      `;
      const result = await client.query(updateQuery, [id]);
      if (result.rowCount === 0) {
        throw new Error(
          `Customer support response with id ${id} not found`,
        );
      }
    });
  }
}

