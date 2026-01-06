import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  CargoEventLogEntity,
  ICargoEventLogRepository,
} from './cargo-event-log.repository.interface';

@Injectable()
export class CargoEventLogRepository implements ICargoEventLogRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<CargoEventLogEntity[]> {
    const query = `
      SELECT id, cargo_id, event_type, event_description, event_time, location_id, location_type, employee_id, created_at
      FROM cargo_event_log
      ORDER BY event_time DESC
    `;
    return await this.databaseService.query<CargoEventLogEntity>(query);
  }

  async findById(id: number): Promise<CargoEventLogEntity | null> {
    const query = `
      SELECT id, cargo_id, event_type, event_description, event_time, location_id, location_type, employee_id, created_at
      FROM cargo_event_log
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<CargoEventLogEntity>(query, [
      id,
    ]);
  }

  async findByCargoId(cargoId: number): Promise<CargoEventLogEntity[]> {
    const query = `
      SELECT id, cargo_id, event_type, event_description, event_time, location_id, location_type, employee_id, created_at
      FROM cargo_event_log
      WHERE cargo_id = $1
      ORDER BY event_time DESC
    `;
    return await this.databaseService.query<CargoEventLogEntity>(query, [
      cargoId,
    ]);
  }

  async findByEventType(eventType: string): Promise<CargoEventLogEntity[]> {
    const query = `
      SELECT id, cargo_id, event_type, event_description, event_time, location_id, location_type, employee_id, created_at
      FROM cargo_event_log
      WHERE event_type = $1
      ORDER BY event_time DESC
    `;
    return await this.databaseService.query<CargoEventLogEntity>(query, [
      eventType,
    ]);
  }

  async findByCargoIdOrdered(
    cargoId: number,
  ): Promise<CargoEventLogEntity[]> {
    const query = `
      SELECT id, cargo_id, event_type, event_description, event_time, location_id, location_type, employee_id, created_at
      FROM cargo_event_log
      WHERE cargo_id = $1
      ORDER BY event_time ASC
    `;
    return await this.databaseService.query<CargoEventLogEntity>(query, [
      cargoId,
    ]);
  }
}

