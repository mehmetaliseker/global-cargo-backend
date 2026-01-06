import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { ProductEntity, IProductRepository } from './product.repository.interface';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<ProductEntity[]> {
    const query = `
      SELECT id, uuid, product_code, cargo_id, name, description, quantity, unit_value, currency_id, created_at, updated_at, deleted_at
      FROM product
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<ProductEntity>(query);
  }

  async findById(id: number): Promise<ProductEntity | null> {
    const query = `
      SELECT id, uuid, product_code, cargo_id, name, description, quantity, unit_value, currency_id, created_at, updated_at, deleted_at
      FROM product
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<ProductEntity>(query, [id]);
  }

  async findByUuid(uuid: string): Promise<ProductEntity | null> {
    const query = `
      SELECT id, uuid, product_code, cargo_id, name, description, quantity, unit_value, currency_id, created_at, updated_at, deleted_at
      FROM product
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<ProductEntity>(query, [uuid]);
  }

  async findByProductCode(productCode: string): Promise<ProductEntity | null> {
    const query = `
      SELECT id, uuid, product_code, cargo_id, name, description, quantity, unit_value, currency_id, created_at, updated_at, deleted_at
      FROM product
      WHERE product_code = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<ProductEntity>(query, [
      productCode,
    ]);
  }

  async findByCargoId(cargoId: number): Promise<ProductEntity[]> {
    const query = `
      SELECT id, uuid, product_code, cargo_id, name, description, quantity, unit_value, currency_id, created_at, updated_at, deleted_at
      FROM product
      WHERE cargo_id = $1 AND deleted_at IS NULL
      ORDER BY created_at ASC
    `;
    return await this.databaseService.query<ProductEntity>(query, [cargoId]);
  }
}

