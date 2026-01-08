import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerSegmentRepository } from '../repositories/customer-segment.repository';
import { CustomerSegmentAssignmentRepository } from '../repositories/customer-segment.repository';
import { CustomerTagRepository } from '../repositories/customer-segment.repository';
import { CustomerTagAssignmentRepository } from '../repositories/customer-segment.repository';
import {
  CustomerSegmentResponseDto,
  CustomerSegmentAssignmentResponseDto,
  CustomerTagResponseDto,
  CustomerTagAssignmentResponseDto,
} from '../dto/customer-segment.dto';
import {
  CustomerSegmentEntity,
  CustomerSegmentAssignmentEntity,
  CustomerTagEntity,
  CustomerTagAssignmentEntity,
} from '../repositories/customer-segment.repository.interface';

@Injectable()
export class CustomerSegmentService {
  constructor(
    private readonly customerSegmentRepository: CustomerSegmentRepository,
  ) {}

  private mapToDto(entity: CustomerSegmentEntity): CustomerSegmentResponseDto {
    let criteria: Record<string, unknown> | undefined = undefined;
    if (entity.criteria) {
      if (typeof entity.criteria === 'string') {
        criteria = JSON.parse(entity.criteria);
      } else {
        criteria = entity.criteria as Record<string, unknown>;
      }
    }

    return {
      id: entity.id,
      uuid: entity.uuid,
      segmentCode: entity.segment_code,
      segmentName: entity.segment_name,
      criteria,
      priority: entity.priority,
      discountPercentage: parseFloat(entity.discount_percentage.toString()),
      isActive: entity.is_active,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<CustomerSegmentResponseDto[]> {
    const entities = await this.customerSegmentRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<CustomerSegmentResponseDto> {
    const entity = await this.customerSegmentRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Customer segment with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<CustomerSegmentResponseDto> {
    const entity = await this.customerSegmentRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(
        `Customer segment with uuid ${uuid} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByCode(segmentCode: string): Promise<CustomerSegmentResponseDto> {
    const entity = await this.customerSegmentRepository.findByCode(segmentCode);
    if (!entity) {
      throw new NotFoundException(
        `Customer segment with code ${segmentCode} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findActive(): Promise<CustomerSegmentResponseDto[]> {
    const entities = await this.customerSegmentRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }
}

@Injectable()
export class CustomerSegmentAssignmentService {
  constructor(
    private readonly customerSegmentAssignmentRepository: CustomerSegmentAssignmentRepository,
  ) {}

  private mapToDto(
    entity: CustomerSegmentAssignmentEntity,
  ): CustomerSegmentAssignmentResponseDto {
    return {
      id: entity.id,
      customerId: entity.customer_id,
      customerSegmentId: entity.customer_segment_id,
      assignedDate: entity.assigned_date.toISOString(),
      assignedBy: entity.assigned_by ?? undefined,
      isActive: entity.is_active,
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<CustomerSegmentAssignmentResponseDto[]> {
    const entities =
      await this.customerSegmentAssignmentRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(
    id: number,
  ): Promise<CustomerSegmentAssignmentResponseDto> {
    const entity = await this.customerSegmentAssignmentRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Customer segment assignment with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByCustomerId(
    customerId: number,
  ): Promise<CustomerSegmentAssignmentResponseDto[]> {
    const entities =
      await this.customerSegmentAssignmentRepository.findByCustomerId(
        customerId,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findBySegmentId(
    segmentId: number,
  ): Promise<CustomerSegmentAssignmentResponseDto[]> {
    const entities =
      await this.customerSegmentAssignmentRepository.findBySegmentId(segmentId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCustomerIdActive(
    customerId: number,
  ): Promise<CustomerSegmentAssignmentResponseDto[]> {
    const entities =
      await this.customerSegmentAssignmentRepository.findByCustomerIdActive(
        customerId,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }
}

@Injectable()
export class CustomerTagService {
  constructor(
    private readonly customerTagRepository: CustomerTagRepository,
  ) {}

  private mapToDto(entity: CustomerTagEntity): CustomerTagResponseDto {
    return {
      id: entity.id,
      uuid: entity.uuid,
      tagName: entity.tag_name,
      tagColor: entity.tag_color ?? undefined,
      description: entity.description ?? undefined,
      isActive: entity.is_active,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<CustomerTagResponseDto[]> {
    const entities = await this.customerTagRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<CustomerTagResponseDto> {
    const entity = await this.customerTagRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Customer tag with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<CustomerTagResponseDto> {
    const entity = await this.customerTagRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(`Customer tag with uuid ${uuid} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByName(tagName: string): Promise<CustomerTagResponseDto> {
    const entity = await this.customerTagRepository.findByName(tagName);
    if (!entity) {
      throw new NotFoundException(
        `Customer tag with name ${tagName} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findActive(): Promise<CustomerTagResponseDto[]> {
    const entities = await this.customerTagRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }
}

@Injectable()
export class CustomerTagAssignmentService {
  constructor(
    private readonly customerTagAssignmentRepository: CustomerTagAssignmentRepository,
  ) {}

  private mapToDto(
    entity: CustomerTagAssignmentEntity,
  ): CustomerTagAssignmentResponseDto {
    return {
      id: entity.id,
      customerId: entity.customer_id,
      customerTagId: entity.customer_tag_id,
      assignedBy: entity.assigned_by ?? undefined,
      assignedDate: entity.assigned_date.toISOString(),
    };
  }

  async findAll(): Promise<CustomerTagAssignmentResponseDto[]> {
    const entities = await this.customerTagAssignmentRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<CustomerTagAssignmentResponseDto> {
    const entity = await this.customerTagAssignmentRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Customer tag assignment with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByCustomerId(
    customerId: number,
  ): Promise<CustomerTagAssignmentResponseDto[]> {
    const entities =
      await this.customerTagAssignmentRepository.findByCustomerId(customerId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByTagId(
    tagId: number,
  ): Promise<CustomerTagAssignmentResponseDto[]> {
    const entities =
      await this.customerTagAssignmentRepository.findByTagId(tagId);
    return entities.map((entity) => this.mapToDto(entity));
  }
}
