import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  DeliveryOptionEntity,
  IDeliveryOptionRepository,
} from './delivery-option.repository.interface';

@Injectable()
export class DeliveryOptionRepository implements IDeliveryOptionRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<DeliveryOptionEntity[]> {
    const query = `
      SELECT id, code, name, description, is_active, created_at, deleted_at
      FROM delivery_option_enum
      WHERE deleted_at IS NULL
      ORDER BY code ASC
    `;
    return await this.databaseService.query<DeliveryOptionEntity>(query);
  }

  async findById(id: number): Promise<DeliveryOptionEntity | null> {
    const query = `
      SELECT id, code, name, description, is_active, created_at, deleted_at
      FROM delivery_option_enum
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<DeliveryOptionEntity>(query, [
      id,
    ]);
  }

  async findByCode(code: string): Promise<DeliveryOptionEntity | null> {
    const query = `
      SELECT id, code, name, description, is_active, created_at, deleted_at
      FROM delivery_option_enum
      WHERE code = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<DeliveryOptionEntity>(query, [
      code,
    ]);
  }

  async findActive(): Promise<DeliveryOptionEntity[]> {
    const query = `
      SELECT id, code, name, description, is_active, created_at, deleted_at
      FROM delivery_option_enum
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY code ASC
    `;
    return await this.databaseService.query<DeliveryOptionEntity>(query);
  }
}

