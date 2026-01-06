import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  CargoReturnRequestEntity,
  ICargoReturnRequestRepository,
} from './cargo-return-request.repository.interface';

@Injectable()
export class CargoReturnRequestRepository
  implements ICargoReturnRequestRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<CargoReturnRequestEntity[]> {
    const query = `
      SELECT id, cargo_id, request_date, reason, status, requested_by, processed_by, processed_date, created_at, updated_at, deleted_at
      FROM cargo_return_request
      WHERE deleted_at IS NULL
      ORDER BY request_date DESC
    `;
    return await this.databaseService.query<CargoReturnRequestEntity>(query);
  }

  async findById(id: number): Promise<CargoReturnRequestEntity | null> {
    const query = `
      SELECT id, cargo_id, request_date, reason, status, requested_by, processed_by, processed_date, created_at, updated_at, deleted_at
      FROM cargo_return_request
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CargoReturnRequestEntity>(
      query,
      [id],
    );
  }

  async findByCargoId(
    cargoId: number,
  ): Promise<CargoReturnRequestEntity | null> {
    const query = `
      SELECT id, cargo_id, request_date, reason, status, requested_by, processed_by, processed_date, created_at, updated_at, deleted_at
      FROM cargo_return_request
      WHERE cargo_id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CargoReturnRequestEntity>(
      query,
      [cargoId],
    );
  }

  async findByStatus(status: string): Promise<CargoReturnRequestEntity[]> {
    const query = `
      SELECT id, cargo_id, request_date, reason, status, requested_by, processed_by, processed_date, created_at, updated_at, deleted_at
      FROM cargo_return_request
      WHERE status = $1 AND deleted_at IS NULL
      ORDER BY request_date DESC
    `;
    return await this.databaseService.query<CargoReturnRequestEntity>(query, [
      status,
    ]);
  }
}

