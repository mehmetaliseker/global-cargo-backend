import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DatabaseService } from '../../../database/database.service';
import { RouteEntity, IRouteRepository } from './route.repository.interface';

@Injectable()
export class RouteRepository implements IRouteRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<RouteEntity[]> {
    const query = `
      SELECT id, uuid, origin_distribution_center_id, destination_distribution_center_id,
             shipment_type_id, route_code, estimated_duration_hours, distance_km,
             is_alternative_route, main_route_id, is_active, created_at, updated_at, deleted_at
      FROM route
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<RouteEntity>(query);
  }

  async findById(id: number): Promise<RouteEntity | null> {
    const query = `
      SELECT id, uuid, origin_distribution_center_id, destination_distribution_center_id,
             shipment_type_id, route_code, estimated_duration_hours, distance_km,
             is_alternative_route, main_route_id, is_active, created_at, updated_at, deleted_at
      FROM route
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<RouteEntity>(query, [id]);
  }

  async findByUuid(uuid: string): Promise<RouteEntity | null> {
    const query = `
      SELECT id, uuid, origin_distribution_center_id, destination_distribution_center_id,
             shipment_type_id, route_code, estimated_duration_hours, distance_km,
             is_alternative_route, main_route_id, is_active, created_at, updated_at, deleted_at
      FROM route
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<RouteEntity>(query, [uuid]);
  }

  async findByRouteCode(routeCode: string): Promise<RouteEntity | null> {
    const query = `
      SELECT id, uuid, origin_distribution_center_id, destination_distribution_center_id,
             shipment_type_id, route_code, estimated_duration_hours, distance_km,
             is_alternative_route, main_route_id, is_active, created_at, updated_at, deleted_at
      FROM route
      WHERE route_code = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<RouteEntity>(query, [routeCode]);
  }

  async findByOriginDistributionCenterId(
    originId: number,
  ): Promise<RouteEntity[]> {
    const query = `
      SELECT id, uuid, origin_distribution_center_id, destination_distribution_center_id,
             shipment_type_id, route_code, estimated_duration_hours, distance_km,
             is_alternative_route, main_route_id, is_active, created_at, updated_at, deleted_at
      FROM route
      WHERE origin_distribution_center_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<RouteEntity>(query, [originId]);
  }

  async findByDestinationDistributionCenterId(
    destinationId: number,
  ): Promise<RouteEntity[]> {
    const query = `
      SELECT id, uuid, origin_distribution_center_id, destination_distribution_center_id,
             shipment_type_id, route_code, estimated_duration_hours, distance_km,
             is_alternative_route, main_route_id, is_active, created_at, updated_at, deleted_at
      FROM route
      WHERE destination_distribution_center_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<RouteEntity>(query, [destinationId]);
  }

  async findByShipmentTypeId(
    shipmentTypeId: number,
  ): Promise<RouteEntity[]> {
    const query = `
      SELECT id, uuid, origin_distribution_center_id, destination_distribution_center_id,
             shipment_type_id, route_code, estimated_duration_hours, distance_km,
             is_alternative_route, main_route_id, is_active, created_at, updated_at, deleted_at
      FROM route
      WHERE shipment_type_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<RouteEntity>(query, [
      shipmentTypeId,
    ]);
  }

  async findActive(): Promise<RouteEntity[]> {
    const query = `
      SELECT id, uuid, origin_distribution_center_id, destination_distribution_center_id,
             shipment_type_id, route_code, estimated_duration_hours, distance_km,
             is_alternative_route, main_route_id, is_active, created_at, updated_at, deleted_at
      FROM route
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<RouteEntity>(query);
  }

  async findByMainRouteId(mainRouteId: number): Promise<RouteEntity[]> {
    const query = `
      SELECT id, uuid, origin_distribution_center_id, destination_distribution_center_id,
             shipment_type_id, route_code, estimated_duration_hours, distance_km,
             is_alternative_route, main_route_id, is_active, created_at, updated_at, deleted_at
      FROM route
      WHERE main_route_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<RouteEntity>(query, [mainRouteId]);
  }

  async findAlternativeRoutes(mainRouteId: number): Promise<RouteEntity[]> {
    const query = `
      SELECT id, uuid, origin_distribution_center_id, destination_distribution_center_id,
             shipment_type_id, route_code, estimated_duration_hours, distance_km,
             is_alternative_route, main_route_id, is_active, created_at, updated_at, deleted_at
      FROM route
      WHERE is_alternative_route = true AND main_route_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<RouteEntity>(query, [mainRouteId]);
  }

  async create(
    originDistributionCenterId: number,
    destinationDistributionCenterId: number,
    shipmentTypeId: number,
    routeCode: string | null,
    estimatedDurationHours: number | null,
    distanceKm: number | null,
    isAlternativeRoute: boolean,
    mainRouteId: number | null,
  ): Promise<RouteEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient): Promise<RouteEntity> => {
        const insertQuery = `
          INSERT INTO route 
            (origin_distribution_center_id, destination_distribution_center_id,
             shipment_type_id, route_code, estimated_duration_hours, distance_km,
             is_alternative_route, main_route_id, is_active)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
          RETURNING id, uuid, origin_distribution_center_id, destination_distribution_center_id,
                    shipment_type_id, route_code, estimated_duration_hours, distance_km,
                    is_alternative_route, main_route_id, is_active, created_at, updated_at, deleted_at
        `;
        const result = await client.query<RouteEntity>(insertQuery, [
          originDistributionCenterId,
          destinationDistributionCenterId,
          shipmentTypeId,
          routeCode,
          estimatedDurationHours,
          distanceKm,
          isAlternativeRoute,
          mainRouteId,
        ]);
        return result.rows[0];
      },
    );
  }

  async update(
    id: number,
    routeCode: string | null,
    estimatedDurationHours: number | null,
    distanceKm: number | null,
    isActive: boolean,
  ): Promise<RouteEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient): Promise<RouteEntity> => {
        const updateQuery = `
          UPDATE route
          SET route_code = $2,
              estimated_duration_hours = $3,
              distance_km = $4,
              is_active = $5,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1 AND deleted_at IS NULL
          RETURNING id, uuid, origin_distribution_center_id, destination_distribution_center_id,
                    shipment_type_id, route_code, estimated_duration_hours, distance_km,
                    is_alternative_route, main_route_id, is_active, created_at, updated_at, deleted_at
        `;
        const result = await client.query<RouteEntity>(updateQuery, [
          id,
          routeCode,
          estimatedDurationHours,
          distanceKm,
          isActive,
        ]);
        if (result.rows.length === 0) {
          throw new Error(`Route with id ${id} not found`);
        }
        return result.rows[0];
      },
    );
  }

  async softDelete(id: number): Promise<void> {
    await this.databaseService.transaction(
      async (client: PoolClient): Promise<void> => {
        const deleteQuery = `
          UPDATE route
          SET deleted_at = CURRENT_TIMESTAMP,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1 AND deleted_at IS NULL
        `;
        const result = await client.query(deleteQuery, [id]);
        if (result.rowCount === 0) {
          throw new Error(`Route with id ${id} not found`);
        }
      },
    );
  }
}

