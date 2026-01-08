import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
    GeoCoordinateEntity,
    IGeoCoordinateRepository,
} from './geo-coordinate.repository.interface';

@Injectable()
export class GeoCoordinateRepository implements IGeoCoordinateRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findAll(): Promise<GeoCoordinateEntity[]> {
        const query = `
      SELECT id, entity_type, entity_id, latitude, longitude,
             accuracy_meters, recorded_at, created_at
      FROM geo_coordinate
      ORDER BY recorded_at DESC
      LIMIT 1000
    `;
        return await this.databaseService.query<GeoCoordinateEntity>(query);
    }

    async findById(id: number): Promise<GeoCoordinateEntity | null> {
        const query = `
      SELECT id, entity_type, entity_id, latitude, longitude,
             accuracy_meters, recorded_at, created_at
      FROM geo_coordinate
      WHERE id = $1
    `;
        return await this.databaseService.queryOne<GeoCoordinateEntity>(query, [id]);
    }

    async findByEntity(entityType: string, entityId: number): Promise<GeoCoordinateEntity[]> {
        const query = `
      SELECT id, entity_type, entity_id, latitude, longitude,
             accuracy_meters, recorded_at, created_at
      FROM geo_coordinate
      WHERE entity_type = $1 AND entity_id = $2
      ORDER BY recorded_at DESC
    `;
        return await this.databaseService.query<GeoCoordinateEntity>(query, [entityType, entityId]);
    }

    async findByEntityLatest(entityType: string, entityId: number): Promise<GeoCoordinateEntity | null> {
        const query = `
      SELECT id, entity_type, entity_id, latitude, longitude,
             accuracy_meters, recorded_at, created_at
      FROM geo_coordinate
      WHERE entity_type = $1 AND entity_id = $2
      ORDER BY recorded_at DESC
      LIMIT 1
    `;
        return await this.databaseService.queryOne<GeoCoordinateEntity>(query, [entityType, entityId]);
    }

    async findByDateRange(startDate: Date, endDate: Date): Promise<GeoCoordinateEntity[]> {
        const query = `
      SELECT id, entity_type, entity_id, latitude, longitude,
             accuracy_meters, recorded_at, created_at
      FROM geo_coordinate
      WHERE recorded_at BETWEEN $1 AND $2
      ORDER BY recorded_at DESC
    `;
        return await this.databaseService.query<GeoCoordinateEntity>(query, [startDate, endDate]);
    }

    async findByEntityAndDateRange(
        entityType: string,
        entityId: number,
        startDate: Date,
        endDate: Date,
    ): Promise<GeoCoordinateEntity[]> {
        const query = `
      SELECT id, entity_type, entity_id, latitude, longitude,
             accuracy_meters, recorded_at, created_at
      FROM geo_coordinate
      WHERE entity_type = $1 
        AND entity_id = $2
        AND recorded_at BETWEEN $3 AND $4
      ORDER BY recorded_at DESC
    `;
        return await this.databaseService.query<GeoCoordinateEntity>(query, [
            entityType,
            entityId,
            startDate,
            endDate,
        ]);
    }
}
