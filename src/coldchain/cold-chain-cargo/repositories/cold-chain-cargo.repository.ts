import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
    ColdChainCargoEntity,
    IColdChainCargoRepository,
} from './cold-chain-cargo.repository.interface';

@Injectable()
export class ColdChainCargoRepository implements IColdChainCargoRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findAll(): Promise<ColdChainCargoEntity[]> {
        const query = `
      SELECT id, cargo_id, required_temperature_min, required_temperature_max,
             temperature_unit, cold_chain_type, monitoring_required,
             created_at, updated_at
      FROM cold_chain_cargo
      ORDER BY created_at DESC
    `;
        return await this.databaseService.query<ColdChainCargoEntity>(query);
    }

    async findById(id: number): Promise<ColdChainCargoEntity | null> {
        const query = `
      SELECT id, cargo_id, required_temperature_min, required_temperature_max,
             temperature_unit, cold_chain_type, monitoring_required,
             created_at, updated_at
      FROM cold_chain_cargo
      WHERE id = $1
    `;
        return await this.databaseService.queryOne<ColdChainCargoEntity>(query, [id]);
    }

    async findByCargoId(cargoId: number): Promise<ColdChainCargoEntity | null> {
        const query = `
      SELECT id, cargo_id, required_temperature_min, required_temperature_max,
             temperature_unit, cold_chain_type, monitoring_required,
             created_at, updated_at
      FROM cold_chain_cargo
      WHERE cargo_id = $1
    `;
        return await this.databaseService.queryOne<ColdChainCargoEntity>(query, [
            cargoId,
        ]);
    }

    async findByColdChainType(type: string): Promise<ColdChainCargoEntity[]> {
        const query = `
      SELECT id, cargo_id, required_temperature_min, required_temperature_max,
             temperature_unit, cold_chain_type, monitoring_required,
             created_at, updated_at
      FROM cold_chain_cargo
      WHERE cold_chain_type = $1
      ORDER BY created_at DESC
    `;
        return await this.databaseService.query<ColdChainCargoEntity>(query, [type]);
    }

    async findMonitoringRequired(): Promise<ColdChainCargoEntity[]> {
        const query = `
      SELECT id, cargo_id, required_temperature_min, required_temperature_max,
             temperature_unit, cold_chain_type, monitoring_required,
             created_at, updated_at
      FROM cold_chain_cargo
      WHERE monitoring_required = true
      ORDER BY created_at DESC
    `;
        return await this.databaseService.query<ColdChainCargoEntity>(query);
    }
}
