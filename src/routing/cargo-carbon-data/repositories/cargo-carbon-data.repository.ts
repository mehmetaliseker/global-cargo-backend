import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DatabaseService } from '../../../database/database.service';
import {
  CargoCarbonDataEntity,
  ICargoCarbonDataRepository,
} from './cargo-carbon-data.repository.interface';

@Injectable()
export class CargoCarbonDataRepository
  implements ICargoCarbonDataRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<CargoCarbonDataEntity[]> {
    const query = `
      SELECT id, cargo_id, carbon_footprint_value, calculation_method, shipment_type_id,
             distance_km, calculation_timestamp, created_at
      FROM cargo_carbon_data
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CargoCarbonDataEntity>(query);
  }

  async findById(id: number): Promise<CargoCarbonDataEntity | null> {
    const query = `
      SELECT id, cargo_id, carbon_footprint_value, calculation_method, shipment_type_id,
             distance_km, calculation_timestamp, created_at
      FROM cargo_carbon_data
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<CargoCarbonDataEntity>(query, [
      id,
    ]);
  }

  async findByCargoId(cargoId: number): Promise<CargoCarbonDataEntity | null> {
    const query = `
      SELECT id, cargo_id, carbon_footprint_value, calculation_method, shipment_type_id,
             distance_km, calculation_timestamp, created_at
      FROM cargo_carbon_data
      WHERE cargo_id = $1
    `;
    return await this.databaseService.queryOne<CargoCarbonDataEntity>(query, [
      cargoId,
    ]);
  }

  async findByShipmentTypeId(
    shipmentTypeId: number,
  ): Promise<CargoCarbonDataEntity[]> {
    const query = `
      SELECT id, cargo_id, carbon_footprint_value, calculation_method, shipment_type_id,
             distance_km, calculation_timestamp, created_at
      FROM cargo_carbon_data
      WHERE shipment_type_id = $1
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CargoCarbonDataEntity>(query, [
      shipmentTypeId,
    ]);
  }

  async create(
    cargoId: number,
    carbonFootprintValue: number,
    calculationMethod: string | null,
    shipmentTypeId: number | null,
    distanceKm: number | null,
  ): Promise<CargoCarbonDataEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient): Promise<CargoCarbonDataEntity> => {
        const insertQuery = `
          INSERT INTO cargo_carbon_data 
            (cargo_id, carbon_footprint_value, calculation_method, shipment_type_id, distance_km)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id, cargo_id, carbon_footprint_value, calculation_method, shipment_type_id,
                    distance_km, calculation_timestamp, created_at
        `;
        const result = await client.query<CargoCarbonDataEntity>(insertQuery, [
          cargoId,
          carbonFootprintValue,
          calculationMethod,
          shipmentTypeId,
          distanceKm,
        ]);
        return result.rows[0];
      },
    );
  }

  async update(
    id: number,
    carbonFootprintValue: number,
    calculationMethod: string | null,
    shipmentTypeId: number | null,
    distanceKm: number | null,
  ): Promise<CargoCarbonDataEntity> {
    return await this.databaseService.transaction(
      async (client: PoolClient): Promise<CargoCarbonDataEntity> => {
        const updateQuery = `
          UPDATE cargo_carbon_data
          SET carbon_footprint_value = $2,
              calculation_method = $3,
              shipment_type_id = $4,
              distance_km = $5,
              calculation_timestamp = CURRENT_TIMESTAMP
          WHERE id = $1
          RETURNING id, cargo_id, carbon_footprint_value, calculation_method, shipment_type_id,
                    distance_km, calculation_timestamp, created_at
        `;
        const result = await client.query<CargoCarbonDataEntity>(updateQuery, [
          id,
          carbonFootprintValue,
          calculationMethod,
          shipmentTypeId,
          distanceKm,
        ]);
        if (result.rows.length === 0) {
          throw new Error(`Cargo carbon data with id ${id} not found`);
        }
        return result.rows[0];
      },
    );
  }
}

