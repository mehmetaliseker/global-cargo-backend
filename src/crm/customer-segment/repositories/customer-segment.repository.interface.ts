export interface CustomerSegmentEntity {
  id: number;
  uuid: string;
  segment_code: string;
  segment_name: string;
  criteria?: Record<string, unknown>;
  priority: number;
  discount_percentage: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface CustomerSegmentAssignmentEntity {
  id: number;
  customer_id: number;
  customer_segment_id: number;
  assigned_date: Date;
  assigned_by?: number;
  is_active: boolean;
  deleted_at?: Date;
}

export interface CustomerTagEntity {
  id: number;
  uuid: string;
  tag_name: string;
  tag_color?: string;
  description?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface CustomerTagAssignmentEntity {
  id: number;
  customer_id: number;
  customer_tag_id: number;
  assigned_by?: number;
  assigned_date: Date;
}

export interface ICustomerSegmentRepository {
  findAll(): Promise<CustomerSegmentEntity[]>;
  findById(id: number): Promise<CustomerSegmentEntity | null>;
  findByUuid(uuid: string): Promise<CustomerSegmentEntity | null>;
  findByCode(segmentCode: string): Promise<CustomerSegmentEntity | null>;
  findActive(): Promise<CustomerSegmentEntity[]>;
}

export interface ICustomerSegmentAssignmentRepository {
  findAll(): Promise<CustomerSegmentAssignmentEntity[]>;
  findById(id: number): Promise<CustomerSegmentAssignmentEntity | null>;
  findByCustomerId(customerId: number): Promise<CustomerSegmentAssignmentEntity[]>;
  findBySegmentId(segmentId: number): Promise<CustomerSegmentAssignmentEntity[]>;
  findByCustomerIdActive(customerId: number): Promise<CustomerSegmentAssignmentEntity[]>;
}

export interface ICustomerTagRepository {
  findAll(): Promise<CustomerTagEntity[]>;
  findById(id: number): Promise<CustomerTagEntity | null>;
  findByUuid(uuid: string): Promise<CustomerTagEntity | null>;
  findByName(tagName: string): Promise<CustomerTagEntity | null>;
  findActive(): Promise<CustomerTagEntity[]>;
}

export interface ICustomerTagAssignmentRepository {
  findAll(): Promise<CustomerTagAssignmentEntity[]>;
  findById(id: number): Promise<CustomerTagAssignmentEntity | null>;
  findByCustomerId(customerId: number): Promise<CustomerTagAssignmentEntity[]>;
  findByTagId(tagId: number): Promise<CustomerTagAssignmentEntity[]>;
}
