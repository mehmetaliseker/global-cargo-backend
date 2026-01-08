import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DatabaseService } from '../../../database/database.service';
import {
  RouteRiskScoreEntity,
  IRouteRiskScoreRepository,
} from './route-risk-score.repository.interface';

@Injectable()
export class RouteRiskScoreRepository
  implements IRouteRiskScoreRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<RouteRiskScoreEntity[]> {
    const query = `
      SELECT id, route_id, origin_country_id, destination_country_id, risk_level,
             risk_score, minimum_risk_threshold, updated_at, created_at
      FROM route_risk_score
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<RouteRiskScoreEntity>(query);
  }

  async findById(id: number): Promise<RouteRiskScoreEntity | null> {
    const query = `
      SELECT id, route_id, origin_country_id, destination_country_id, risk_level,
             risk_score, minimum_risk_threshold, updated_at, created_at
      FROM route_risk_score
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<RouteRiskScoreEntity>(query, [
      id,
    ]);
  }

  async findByRouteId(routeId: number): Promise<RouteRiskScoreEntity | null> {
    const query = `
      SELECT id, route_id, origin_country_id, destination_country_id, risk_level,
             risk_score, minimum_risk_threshold, updated_at, created_at
      FROM route_risk_score
      WHERE route_id = $1
    `;
    return await this.databaseService.queryOne<RouteRiskScoreEntity>(query, [
      routeId,
    ]);
  }

  async findByOriginCountryId(
    originCountryId: number,
  ): Promise<RouteRiskScoreEntity[]> {
    const query = `
      SELECT id, route_id, origin_country_id, destination_country_id, risk_level,
             risk_score, minimum_risk_threshold, updated_at, created_at
      FROM route_risk_score
      WHERE origin_country_id = $1
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<RouteRiskScoreEntity>(query, [
      originCountryId,
    ]);
  }

  async findByDestinationCountryId(
    destinationCountryId: number,
  ): Promise<RouteRiskScoreEntity[]> {
    const query = `
      SELECT id, route_id, origin_country_id, destination_country_id, risk_level,
             risk_score, minimum_risk_threshold, updated_at, created_at
      FROM route_risk_score
      WHERE destination_country_id = $1
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<RouteRiskScoreEntity>(query, [
      destinationCountryId,
    ]);
  }

  async findByCountries(
    originCountryId: number,
    destinationCountryId: number,
  ): Promise<RouteRiskScoreEntity[]> {
    const query = `
      SELECT id, route_id, origin_country_id, destination_country_id, risk_level,
             risk_score, minimum_risk_threshold, updated_at, created_at
      FROM route_risk_score
      WHERE origin_country_id = $1 AND destination_country_id = $2
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<RouteRiskScoreEntity>(query, [
      originCountryId,
      destinationCountryId,
    ]);
  }

  async findByRiskLevel(riskLevel: string): Promise<RouteRiskScoreEntity[]> {
    const query = `
      SELECT id, route_id, origin_country_id, destination_country_id, risk_level,
             risk_score, minimum_risk_threshold, updated_at, created_at
      FROM route_risk_score
      WHERE risk_level = $1
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<RouteRiskScoreEntity>(query, [
      riskLevel,
    ]);
  }

  async create(
    routeId: number,
    originCountryId: number,
    destinationCountryId: number,
    riskLevel: string,
    riskScore: number,
    minimumRiskThreshold: number,
  ): Promise<RouteRiskScoreEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient): Promise<RouteRiskScoreEntity> => {
        const insertQuery = `
          INSERT INTO route_risk_score 
            (route_id, origin_country_id, destination_country_id, risk_level,
             risk_score, minimum_risk_threshold)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id, route_id, origin_country_id, destination_country_id, risk_level,
                    risk_score, minimum_risk_threshold, updated_at, created_at
        `;
        const result = await client.query<RouteRiskScoreEntity>(insertQuery, [
          routeId,
          originCountryId,
          destinationCountryId,
          riskLevel,
          riskScore,
          minimumRiskThreshold,
        ]);
        return result.rows[0];
      },
    );
  }

  async update(
    id: number,
    riskLevel: string,
    riskScore: number,
    minimumRiskThreshold: number,
  ): Promise<RouteRiskScoreEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient): Promise<RouteRiskScoreEntity> => {
        const updateQuery = `
          UPDATE route_risk_score
          SET risk_level = $2,
              risk_score = $3,
              minimum_risk_threshold = $4,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
          RETURNING id, route_id, origin_country_id, destination_country_id, risk_level,
                    risk_score, minimum_risk_threshold, updated_at, created_at
        `;
        const result = await client.query<RouteRiskScoreEntity>(updateQuery, [
          id,
          riskLevel,
          riskScore,
          minimumRiskThreshold,
        ]);
        if (result.rows.length === 0) {
          throw new Error(`Route risk score with id ${id} not found`);
        }
        return result.rows[0];
      },
    );
  }
}

