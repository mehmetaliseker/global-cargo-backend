import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  CargoMovementHistoryEntity,
  ICargoMovementHistoryRepository,
} from './cargo-movement-history.repository.interface';

@Injectable()
export class CargoMovementHistoryRepository
  implements ICargoMovementHistoryRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<CargoMovementHistoryEntity[]> {
    const query = `
      SELECT id, cargo_id, location_type, branch_id, distribution_center_id, movement_date, status, description, created_at
      FROM cargo_movement_history
      ORDER BY movement_date DESC
    `;
    return await this.databaseService.query<CargoMovementHistoryEntity>(query);
  }

  async findById(id: number): Promise<CargoMovementHistoryEntity | null> {
    const query = `
      SELECT id, cargo_id, location_type, branch_id, distribution_center_id, movement_date, status, description, created_at
      FROM cargo_movement_history
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<CargoMovementHistoryEntity>(
      query,
      [id],
    );
  }

  async findByCargoId(
    cargoId: number,
  ): Promise<CargoMovementHistoryEntity[]> {
    const query = `
      SELECT id, cargo_id, location_type, branch_id, distribution_center_id, movement_date, status, description, created_at
      FROM cargo_movement_history
      WHERE cargo_id = $1
      ORDER BY movement_date DESC
    `;
    return await this.databaseService.query<CargoMovementHistoryEntity>(
      query,
      [cargoId],
    );
  }

  async findByCargoIdOrdered(
    cargoId: number,
  ): Promise<CargoMovementHistoryEntity[]> {
    const query = `
      SELECT id, cargo_id, location_type, branch_id, distribution_center_id, movement_date, status, description, created_at
      FROM cargo_movement_history
      WHERE cargo_id = $1
      ORDER BY movement_date ASC
    `;
    return await this.databaseService.query<CargoMovementHistoryEntity>(
      query,
      [cargoId],
    );
  }
}

