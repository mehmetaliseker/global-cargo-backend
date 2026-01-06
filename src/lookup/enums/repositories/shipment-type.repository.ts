import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  ShipmentTypeEntity,
  IShipmentTypeRepository,
} from './shipment-type.repository.interface';

@Injectable()
export class ShipmentTypeRepository implements IShipmentTypeRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<ShipmentTypeEntity[]> {
    const query = `
      SELECT id, code, name, description, is_active, created_at, deleted_at
      FROM shipment_type_enum
      WHERE deleted_at IS NULL
      ORDER BY code ASC
    `;
    return await this.databaseService.query<ShipmentTypeEntity>(query);
  }

  async findById(id: number): Promise<ShipmentTypeEntity | null> {
    const query = `
      SELECT id, code, name, description, is_active, created_at, deleted_at
      FROM shipment_type_enum
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<ShipmentTypeEntity>(query, [
      id,
    ]);
  }

  async findByCode(code: string): Promise<ShipmentTypeEntity | null> {
    const query = `
      SELECT id, code, name, description, is_active, created_at, deleted_at
      FROM shipment_type_enum
      WHERE code = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<ShipmentTypeEntity>(query, [
      code,
    ]);
  }

  async findActive(): Promise<ShipmentTypeEntity[]> {
    const query = `
      SELECT id, code, name, description, is_active, created_at, deleted_at
      FROM shipment_type_enum
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY code ASC
    `;
    return await this.databaseService.query<ShipmentTypeEntity>(query);
  }
}

