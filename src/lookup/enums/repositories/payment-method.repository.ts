import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  PaymentMethodEntity,
  IPaymentMethodRepository,
} from './payment-method.repository.interface';

@Injectable()
export class PaymentMethodRepository implements IPaymentMethodRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<PaymentMethodEntity[]> {
    const query = `
      SELECT id, code, name, description, is_active, created_at, deleted_at
      FROM payment_method_enum
      WHERE deleted_at IS NULL
      ORDER BY code ASC
    `;
    return await this.databaseService.query<PaymentMethodEntity>(query);
  }

  async findById(id: number): Promise<PaymentMethodEntity | null> {
    const query = `
      SELECT id, code, name, description, is_active, created_at, deleted_at
      FROM payment_method_enum
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<PaymentMethodEntity>(query, [
      id,
    ]);
  }

  async findByCode(code: string): Promise<PaymentMethodEntity | null> {
    const query = `
      SELECT id, code, name, description, is_active, created_at, deleted_at
      FROM payment_method_enum
      WHERE code = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<PaymentMethodEntity>(query, [
      code,
    ]);
  }

  async findActive(): Promise<PaymentMethodEntity[]> {
    const query = `
      SELECT id, code, name, description, is_active, created_at, deleted_at
      FROM payment_method_enum
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY code ASC
    `;
    return await this.databaseService.query<PaymentMethodEntity>(query);
  }
}

