import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  CargoStateHistoryEntity,
  ICargoStateHistoryRepository,
} from './cargo-state-history.repository.interface';

@Injectable()
export class CargoStateHistoryRepository
  implements ICargoStateHistoryRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<CargoStateHistoryEntity[]> {
    const query = `
      SELECT id, cargo_id, state_id, event_time, description, changed_by, created_at
      FROM cargo_state_history
      ORDER BY event_time DESC
    `;
    return await this.databaseService.query<CargoStateHistoryEntity>(query);
  }

  async findById(id: number): Promise<CargoStateHistoryEntity | null> {
    const query = `
      SELECT id, cargo_id, state_id, event_time, description, changed_by, created_at
      FROM cargo_state_history
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<CargoStateHistoryEntity>(
      query,
      [id],
    );
  }

  async findByCargoId(cargoId: number): Promise<CargoStateHistoryEntity[]> {
    const query = `
      SELECT id, cargo_id, state_id, event_time, description, changed_by, created_at
      FROM cargo_state_history
      WHERE cargo_id = $1
      ORDER BY event_time DESC
    `;
    return await this.databaseService.query<CargoStateHistoryEntity>(query, [
      cargoId,
    ]);
  }

  async findByStateId(stateId: number): Promise<CargoStateHistoryEntity[]> {
    const query = `
      SELECT id, cargo_id, state_id, event_time, description, changed_by, created_at
      FROM cargo_state_history
      WHERE state_id = $1
      ORDER BY event_time DESC
    `;
    return await this.databaseService.query<CargoStateHistoryEntity>(query, [
      stateId,
    ]);
  }

  async findByCargoIdOrdered(
    cargoId: number,
  ): Promise<CargoStateHistoryEntity[]> {
    const query = `
      SELECT id, cargo_id, state_id, event_time, description, changed_by, created_at
      FROM cargo_state_history
      WHERE cargo_id = $1
      ORDER BY event_time ASC
    `;
    return await this.databaseService.query<CargoStateHistoryEntity>(query, [
      cargoId,
    ]);
  }
}

