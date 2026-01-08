import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
    RouteVisualizationEntity,
    IRouteVisualizationRepository,
} from './route-visualization.repository.interface';

@Injectable()
export class RouteVisualizationRepository implements IRouteVisualizationRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findAll(): Promise<RouteVisualizationEntity[]> {
        const query = `
      SELECT id, route_id, visualization_data, map_style,
             zoom_level, created_at, updated_at
      FROM route_visualization
      ORDER BY updated_at DESC
    `;
        return await this.databaseService.query<RouteVisualizationEntity>(query);
    }

    async findById(id: number): Promise<RouteVisualizationEntity | null> {
        const query = `
      SELECT id, route_id, visualization_data, map_style,
             zoom_level, created_at, updated_at
      FROM route_visualization
      WHERE id = $1
    `;
        return await this.databaseService.queryOne<RouteVisualizationEntity>(query, [id]);
    }

    async findByRouteId(routeId: number): Promise<RouteVisualizationEntity[]> {
        const query = `
      SELECT id, route_id, visualization_data, map_style,
             zoom_level, created_at, updated_at
      FROM route_visualization
      WHERE route_id = $1
      ORDER BY updated_at DESC
    `;
        return await this.databaseService.query<RouteVisualizationEntity>(query, [routeId]);
    }

    async findByRouteIdLatest(routeId: number): Promise<RouteVisualizationEntity | null> {
        const query = `
      SELECT id, route_id, visualization_data, map_style,
             zoom_level, created_at, updated_at
      FROM route_visualization
      WHERE route_id = $1
      ORDER BY updated_at DESC
      LIMIT 1
    `;
        return await this.databaseService.queryOne<RouteVisualizationEntity>(query, [routeId]);
    }
}
