import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DatabaseService } from '../../../database/database.service';
import {
  CargoRouteAssignmentEntity,
  ICargoRouteAssignmentRepository,
} from './cargo-route-assignment.repository.interface';

@Injectable()
export class CargoRouteAssignmentRepository
  implements ICargoRouteAssignmentRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<CargoRouteAssignmentEntity[]> {
    const query = `
      SELECT id, cargo_id, route_id, assigned_date, assigned_by, is_active, created_at
      FROM cargo_route_assignment
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CargoRouteAssignmentEntity>(query);
  }

  async findById(id: number): Promise<CargoRouteAssignmentEntity | null> {
    const query = `
      SELECT id, cargo_id, route_id, assigned_date, assigned_by, is_active, created_at
      FROM cargo_route_assignment
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<CargoRouteAssignmentEntity>(
      query,
      [id],
    );
  }

  async findByCargoId(cargoId: number): Promise<CargoRouteAssignmentEntity | null> {
    const query = `
      SELECT id, cargo_id, route_id, assigned_date, assigned_by, is_active, created_at
      FROM cargo_route_assignment
      WHERE cargo_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `;
    return await this.databaseService.queryOne<CargoRouteAssignmentEntity>(
      query,
      [cargoId],
    );
  }

  async findByCargoIdActive(cargoId: number): Promise<CargoRouteAssignmentEntity | null> {
    const query = `
      SELECT id, cargo_id, route_id, assigned_date, assigned_by, is_active, created_at
      FROM cargo_route_assignment
      WHERE cargo_id = $1 AND is_active = true
      ORDER BY created_at DESC
      LIMIT 1
    `;
    return await this.databaseService.queryOne<CargoRouteAssignmentEntity>(
      query,
      [cargoId],
    );
  }

  async findByRouteId(routeId: number): Promise<CargoRouteAssignmentEntity[]> {
    const query = `
      SELECT id, cargo_id, route_id, assigned_date, assigned_by, is_active, created_at
      FROM cargo_route_assignment
      WHERE route_id = $1
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CargoRouteAssignmentEntity>(
      query,
      [routeId],
    );
  }

  async findByRouteIdActive(routeId: number): Promise<CargoRouteAssignmentEntity[]> {
    const query = `
      SELECT id, cargo_id, route_id, assigned_date, assigned_by, is_active, created_at
      FROM cargo_route_assignment
      WHERE route_id = $1 AND is_active = true
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CargoRouteAssignmentEntity>(
      query,
      [routeId],
    );
  }

  async findActive(): Promise<CargoRouteAssignmentEntity[]> {
    const query = `
      SELECT id, cargo_id, route_id, assigned_date, assigned_by, is_active, created_at
      FROM cargo_route_assignment
      WHERE is_active = true
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CargoRouteAssignmentEntity>(query);
  }

  async create(
    cargoId: number,
    routeId: number,
    assignedBy: number | null,
  ): Promise<CargoRouteAssignmentEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient): Promise<CargoRouteAssignmentEntity> => {
        const deactivateExistingQuery = `
          UPDATE cargo_route_assignment
          SET is_active = false
          WHERE cargo_id = $1 AND is_active = true
        `;
        await client.query(deactivateExistingQuery, [cargoId]);

        const insertQuery = `
          INSERT INTO cargo_route_assignment 
            (cargo_id, route_id, assigned_by, is_active)
          VALUES ($1, $2, $3, true)
          RETURNING id, cargo_id, route_id, assigned_date, assigned_by, is_active, created_at
        `;
        const result = await client.query<CargoRouteAssignmentEntity>(
          insertQuery,
          [cargoId, routeId, assignedBy],
        );
        return result.rows[0];
      },
    );
  }

  async deactivate(id: number): Promise<CargoRouteAssignmentEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient): Promise<CargoRouteAssignmentEntity> => {
        const updateQuery = `
          UPDATE cargo_route_assignment
          SET is_active = false
          WHERE id = $1
          RETURNING id, cargo_id, route_id, assigned_date, assigned_by, is_active, created_at
        `;
        const result = await client.query<CargoRouteAssignmentEntity>(
          updateQuery,
          [id],
        );
        if (result.rows.length === 0) {
          throw new Error(`Cargo route assignment with id ${id} not found`);
        }
        return result.rows[0];
      },
    );
  }
}

