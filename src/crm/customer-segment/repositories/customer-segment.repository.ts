import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  CustomerSegmentEntity,
  ICustomerSegmentRepository,
  CustomerSegmentAssignmentEntity,
  ICustomerSegmentAssignmentRepository,
  CustomerTagEntity,
  ICustomerTagRepository,
  CustomerTagAssignmentEntity,
  ICustomerTagAssignmentRepository,
} from './customer-segment.repository.interface';

@Injectable()
export class CustomerSegmentRepository implements ICustomerSegmentRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<CustomerSegmentEntity[]> {
    const query = `
      SELECT id, uuid, segment_code, segment_name, criteria, priority,
             discount_percentage, is_active, created_at, updated_at, deleted_at
      FROM customer_segment
      WHERE deleted_at IS NULL
      ORDER BY priority DESC, segment_name ASC
    `;
    return await this.databaseService.query<CustomerSegmentEntity>(query);
  }

  async findById(id: number): Promise<CustomerSegmentEntity | null> {
    const query = `
      SELECT id, uuid, segment_code, segment_name, criteria, priority,
             discount_percentage, is_active, created_at, updated_at, deleted_at
      FROM customer_segment
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CustomerSegmentEntity>(query, [
      id,
    ]);
  }

  async findByUuid(uuid: string): Promise<CustomerSegmentEntity | null> {
    const query = `
      SELECT id, uuid, segment_code, segment_name, criteria, priority,
             discount_percentage, is_active, created_at, updated_at, deleted_at
      FROM customer_segment
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CustomerSegmentEntity>(query, [
      uuid,
    ]);
  }

  async findByCode(
    segmentCode: string,
  ): Promise<CustomerSegmentEntity | null> {
    const query = `
      SELECT id, uuid, segment_code, segment_name, criteria, priority,
             discount_percentage, is_active, created_at, updated_at, deleted_at
      FROM customer_segment
      WHERE segment_code = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CustomerSegmentEntity>(query, [
      segmentCode,
    ]);
  }

  async findActive(): Promise<CustomerSegmentEntity[]> {
    const query = `
      SELECT id, uuid, segment_code, segment_name, criteria, priority,
             discount_percentage, is_active, created_at, updated_at, deleted_at
      FROM customer_segment
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY priority DESC, segment_name ASC
    `;
    return await this.databaseService.query<CustomerSegmentEntity>(query);
  }
}

@Injectable()
export class CustomerSegmentAssignmentRepository
  implements ICustomerSegmentAssignmentRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<CustomerSegmentAssignmentEntity[]> {
    const query = `
      SELECT id, customer_id, customer_segment_id, assigned_date, assigned_by,
             is_active, deleted_at
      FROM customer_segment_assignment
      WHERE deleted_at IS NULL
      ORDER BY assigned_date DESC
    `;
    return await this.databaseService.query<CustomerSegmentAssignmentEntity>(
      query,
    );
  }

  async findById(
    id: number,
  ): Promise<CustomerSegmentAssignmentEntity | null> {
    const query = `
      SELECT id, customer_id, customer_segment_id, assigned_date, assigned_by,
             is_active, deleted_at
      FROM customer_segment_assignment
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CustomerSegmentAssignmentEntity>(
      query,
      [id],
    );
  }

  async findByCustomerId(
    customerId: number,
  ): Promise<CustomerSegmentAssignmentEntity[]> {
    const query = `
      SELECT id, customer_id, customer_segment_id, assigned_date, assigned_by,
             is_active, deleted_at
      FROM customer_segment_assignment
      WHERE customer_id = $1 AND deleted_at IS NULL
      ORDER BY assigned_date DESC
    `;
    return await this.databaseService.query<CustomerSegmentAssignmentEntity>(
      query,
      [customerId],
    );
  }

  async findBySegmentId(
    segmentId: number,
  ): Promise<CustomerSegmentAssignmentEntity[]> {
    const query = `
      SELECT id, customer_id, customer_segment_id, assigned_date, assigned_by,
             is_active, deleted_at
      FROM customer_segment_assignment
      WHERE customer_segment_id = $1 AND deleted_at IS NULL
      ORDER BY assigned_date DESC
    `;
    return await this.databaseService.query<CustomerSegmentAssignmentEntity>(
      query,
      [segmentId],
    );
  }

  async findByCustomerIdActive(
    customerId: number,
  ): Promise<CustomerSegmentAssignmentEntity[]> {
    const query = `
      SELECT id, customer_id, customer_segment_id, assigned_date, assigned_by,
             is_active, deleted_at
      FROM customer_segment_assignment
      WHERE customer_id = $1 AND is_active = true AND deleted_at IS NULL
      ORDER BY assigned_date DESC
    `;
    return await this.databaseService.query<CustomerSegmentAssignmentEntity>(
      query,
      [customerId],
    );
  }
}

@Injectable()
export class CustomerTagRepository implements ICustomerTagRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<CustomerTagEntity[]> {
    const query = `
      SELECT id, uuid, tag_name, tag_color, description, is_active,
             created_at, updated_at, deleted_at
      FROM customer_tag
      WHERE deleted_at IS NULL
      ORDER BY tag_name ASC
    `;
    return await this.databaseService.query<CustomerTagEntity>(query);
  }

  async findById(id: number): Promise<CustomerTagEntity | null> {
    const query = `
      SELECT id, uuid, tag_name, tag_color, description, is_active,
             created_at, updated_at, deleted_at
      FROM customer_tag
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CustomerTagEntity>(query, [id]);
  }

  async findByUuid(uuid: string): Promise<CustomerTagEntity | null> {
    const query = `
      SELECT id, uuid, tag_name, tag_color, description, is_active,
             created_at, updated_at, deleted_at
      FROM customer_tag
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CustomerTagEntity>(query, [
      uuid,
    ]);
  }

  async findByName(tagName: string): Promise<CustomerTagEntity | null> {
    const query = `
      SELECT id, uuid, tag_name, tag_color, description, is_active,
             created_at, updated_at, deleted_at
      FROM customer_tag
      WHERE tag_name = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CustomerTagEntity>(query, [
      tagName,
    ]);
  }

  async findActive(): Promise<CustomerTagEntity[]> {
    const query = `
      SELECT id, uuid, tag_name, tag_color, description, is_active,
             created_at, updated_at, deleted_at
      FROM customer_tag
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY tag_name ASC
    `;
    return await this.databaseService.query<CustomerTagEntity>(query);
  }
}

@Injectable()
export class CustomerTagAssignmentRepository
  implements ICustomerTagAssignmentRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<CustomerTagAssignmentEntity[]> {
    const query = `
      SELECT id, customer_id, customer_tag_id, assigned_by, assigned_date
      FROM customer_tag_assignment
      ORDER BY assigned_date DESC
    `;
    return await this.databaseService.query<CustomerTagAssignmentEntity>(
      query,
    );
  }

  async findById(id: number): Promise<CustomerTagAssignmentEntity | null> {
    const query = `
      SELECT id, customer_id, customer_tag_id, assigned_by, assigned_date
      FROM customer_tag_assignment
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<CustomerTagAssignmentEntity>(
      query,
      [id],
    );
  }

  async findByCustomerId(
    customerId: number,
  ): Promise<CustomerTagAssignmentEntity[]> {
    const query = `
      SELECT id, customer_id, customer_tag_id, assigned_by, assigned_date
      FROM customer_tag_assignment
      WHERE customer_id = $1
      ORDER BY assigned_date DESC
    `;
    return await this.databaseService.query<CustomerTagAssignmentEntity>(
      query,
      [customerId],
    );
  }

  async findByTagId(
    tagId: number,
  ): Promise<CustomerTagAssignmentEntity[]> {
    const query = `
      SELECT id, customer_id, customer_tag_id, assigned_by, assigned_date
      FROM customer_tag_assignment
      WHERE customer_tag_id = $1
      ORDER BY assigned_date DESC
    `;
    return await this.databaseService.query<CustomerTagAssignmentEntity>(
      query,
      [tagId],
    );
  }
}
