import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { StateEntity, IStateRepository } from './state.repository.interface';

@Injectable()
export class StateRepository implements IStateRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<StateEntity[]> {
    const query = `
      SELECT id, code, name, description, is_active, created_at, deleted_at
      FROM state_enum
      WHERE deleted_at IS NULL
      ORDER BY code ASC
    `;
    return await this.databaseService.query<StateEntity>(query);
  }

  async findById(id: number): Promise<StateEntity | null> {
    const query = `
      SELECT id, code, name, description, is_active, created_at, deleted_at
      FROM state_enum
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<StateEntity>(query, [id]);
  }

  async findByCode(code: string): Promise<StateEntity | null> {
    const query = `
      SELECT id, code, name, description, is_active, created_at, deleted_at
      FROM state_enum
      WHERE code = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<StateEntity>(query, [code]);
  }

  async findActive(): Promise<StateEntity[]> {
    const query = `
      SELECT id, code, name, description, is_active, created_at, deleted_at
      FROM state_enum
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY code ASC
    `;
    return await this.databaseService.query<StateEntity>(query);
  }
}

