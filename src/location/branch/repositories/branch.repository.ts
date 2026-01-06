import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { BranchEntity, IBranchRepository } from './branch.repository.interface';

@Injectable()
export class BranchRepository implements IBranchRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<BranchEntity[]> {
    const query = `
      SELECT id, uuid, district_id, name, code, address, phone, email, is_active, created_at, updated_at, deleted_at
      FROM branch
      WHERE deleted_at IS NULL
      ORDER BY name ASC
    `;
    return await this.databaseService.query<BranchEntity>(query);
  }

  async findById(id: number): Promise<BranchEntity | null> {
    const query = `
      SELECT id, uuid, district_id, name, code, address, phone, email, is_active, created_at, updated_at, deleted_at
      FROM branch
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<BranchEntity>(query, [id]);
  }

  async findByUuid(uuid: string): Promise<BranchEntity | null> {
    const query = `
      SELECT id, uuid, district_id, name, code, address, phone, email, is_active, created_at, updated_at, deleted_at
      FROM branch
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<BranchEntity>(query, [uuid]);
  }

  async findByDistrictId(districtId: number): Promise<BranchEntity[]> {
    const query = `
      SELECT id, uuid, district_id, name, code, address, phone, email, is_active, created_at, updated_at, deleted_at
      FROM branch
      WHERE district_id = $1 AND deleted_at IS NULL
      ORDER BY name ASC
    `;
    return await this.databaseService.query<BranchEntity>(query, [districtId]);
  }

  async findActive(): Promise<BranchEntity[]> {
    const query = `
      SELECT id, uuid, district_id, name, code, address, phone, email, is_active, created_at, updated_at, deleted_at
      FROM branch
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY name ASC
    `;
    return await this.databaseService.query<BranchEntity>(query);
  }

  async findByDistrictIdAndActive(districtId: number): Promise<BranchEntity[]> {
    const query = `
      SELECT id, uuid, district_id, name, code, address, phone, email, is_active, created_at, updated_at, deleted_at
      FROM branch
      WHERE district_id = $1 AND is_active = true AND deleted_at IS NULL
      ORDER BY name ASC
    `;
    return await this.databaseService.query<BranchEntity>(query, [districtId]);
  }
}

