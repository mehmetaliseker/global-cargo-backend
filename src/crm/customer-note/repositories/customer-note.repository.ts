import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  CustomerNoteEntity,
  ICustomerNoteRepository,
} from './customer-note.repository.interface';

@Injectable()
export class CustomerNoteRepository implements ICustomerNoteRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<CustomerNoteEntity[]> {
    const query = `
      SELECT id, customer_id, note_text, note_type, created_by, is_private,
             created_at, updated_at, deleted_at
      FROM customer_note
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CustomerNoteEntity>(query);
  }

  async findById(id: number): Promise<CustomerNoteEntity | null> {
    const query = `
      SELECT id, customer_id, note_text, note_type, created_by, is_private,
             created_at, updated_at, deleted_at
      FROM customer_note
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CustomerNoteEntity>(query, [id]);
  }

  async findByCustomerId(customerId: number): Promise<CustomerNoteEntity[]> {
    const query = `
      SELECT id, customer_id, note_text, note_type, created_by, is_private,
             created_at, updated_at, deleted_at
      FROM customer_note
      WHERE customer_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CustomerNoteEntity>(query, [
      customerId,
    ]);
  }

  async findByNoteType(noteType: string): Promise<CustomerNoteEntity[]> {
    const query = `
      SELECT id, customer_id, note_text, note_type, created_by, is_private,
             created_at, updated_at, deleted_at
      FROM customer_note
      WHERE note_type = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CustomerNoteEntity>(query, [
      noteType,
    ]);
  }

  async findByCreatedBy(createdBy: number): Promise<CustomerNoteEntity[]> {
    const query = `
      SELECT id, customer_id, note_text, note_type, created_by, is_private,
             created_at, updated_at, deleted_at
      FROM customer_note
      WHERE created_by = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CustomerNoteEntity>(query, [
      createdBy,
    ]);
  }

  async findPublic(): Promise<CustomerNoteEntity[]> {
    const query = `
      SELECT id, customer_id, note_text, note_type, created_by, is_private,
             created_at, updated_at, deleted_at
      FROM customer_note
      WHERE is_private = false AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CustomerNoteEntity>(query);
  }

  async findPrivate(): Promise<CustomerNoteEntity[]> {
    const query = `
      SELECT id, customer_id, note_text, note_type, created_by, is_private,
             created_at, updated_at, deleted_at
      FROM customer_note
      WHERE is_private = true AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CustomerNoteEntity>(query);
  }
}
