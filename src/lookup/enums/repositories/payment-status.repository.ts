import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  PaymentStatusEntity,
  IPaymentStatusRepository,
} from './payment-status.repository.interface';

@Injectable()
export class PaymentStatusRepository implements IPaymentStatusRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<PaymentStatusEntity[]> {
    const query = `
      SELECT id, code, name, description, is_active, created_at, deleted_at
      FROM payment_status_enum
      WHERE deleted_at IS NULL
      ORDER BY code ASC
    `;
    return await this.databaseService.query<PaymentStatusEntity>(query);
  }

  async findById(id: number): Promise<PaymentStatusEntity | null> {
    const query = `
      SELECT id, code, name, description, is_active, created_at, deleted_at
      FROM payment_status_enum
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<PaymentStatusEntity>(query, [
      id,
    ]);
  }

  async findByCode(code: string): Promise<PaymentStatusEntity | null> {
    const query = `
      SELECT id, code, name, description, is_active, created_at, deleted_at
      FROM payment_status_enum
      WHERE code = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<PaymentStatusEntity>(query, [
      code,
    ]);
  }

  async findActive(): Promise<PaymentStatusEntity[]> {
    const query = `
      SELECT id, code, name, description, is_active, created_at, deleted_at
      FROM payment_status_enum
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY code ASC
    `;
    return await this.databaseService.query<PaymentStatusEntity>(query);
  }
}

