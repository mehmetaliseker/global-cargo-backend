import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CustomerSupportRequestRepository } from '../repositories/customer-support-request.repository';
import {
  CustomerSupportRequestResponseDto,
  CreateCustomerSupportRequestDto,
  UpdateCustomerSupportRequestDto,
  SupportRequestPriority,
  SupportRequestStatus,
} from '../dto/customer-support-request.dto';
import { CustomerSupportRequestEntity } from '../repositories/customer-support-request.repository.interface';

@Injectable()
export class CustomerSupportRequestService {
  constructor(
    private readonly customerSupportRequestRepository: CustomerSupportRequestRepository,
  ) {}

  private mapToDto(
    entity: CustomerSupportRequestEntity,
  ): CustomerSupportRequestResponseDto {
    return {
      id: entity.id,
      uuid: entity.uuid,
      customerId: entity.customer_id,
      cargoId: entity.cargo_id ?? undefined,
      requestType: entity.request_type,
      subject: entity.subject ?? undefined,
      description: entity.description,
      priority: entity.priority,
      status: entity.status,
      assignedTo: entity.assigned_to ?? undefined,
      requestedDate: entity.requested_date.toISOString(),
      resolvedDate: entity.resolved_date?.toISOString(),
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<CustomerSupportRequestResponseDto[]> {
    const entities =
      await this.customerSupportRequestRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<CustomerSupportRequestResponseDto> {
    const entity = await this.customerSupportRequestRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Customer support request with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<CustomerSupportRequestResponseDto> {
    const entity = await this.customerSupportRequestRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(
        `Customer support request with uuid ${uuid} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByCustomerId(
    customerId: number,
  ): Promise<CustomerSupportRequestResponseDto[]> {
    const entities =
      await this.customerSupportRequestRepository.findByCustomerId(customerId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCargoId(
    cargoId: number,
  ): Promise<CustomerSupportRequestResponseDto[]> {
    const entities =
      await this.customerSupportRequestRepository.findByCargoId(cargoId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByStatus(
    status: string,
  ): Promise<CustomerSupportRequestResponseDto[]> {
    if (!Object.values(SupportRequestStatus).includes(status as SupportRequestStatus)) {
      throw new BadRequestException(`Invalid status: ${status}`);
    }
    const entities =
      await this.customerSupportRequestRepository.findByStatus(status);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByPriority(
    priority: string,
  ): Promise<CustomerSupportRequestResponseDto[]> {
    if (!Object.values(SupportRequestPriority).includes(priority as SupportRequestPriority)) {
      throw new BadRequestException(`Invalid priority: ${priority}`);
    }
    const entities =
      await this.customerSupportRequestRepository.findByPriority(priority);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByAssignedTo(
    employeeId: number,
  ): Promise<CustomerSupportRequestResponseDto[]> {
    const entities =
      await this.customerSupportRequestRepository.findByAssignedTo(employeeId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCustomerIdAndStatus(
    customerId: number,
    status: string,
  ): Promise<CustomerSupportRequestResponseDto[]> {
    if (!Object.values(SupportRequestStatus).includes(status as SupportRequestStatus)) {
      throw new BadRequestException(`Invalid status: ${status}`);
    }
    const entities =
      await this.customerSupportRequestRepository.findByCustomerIdAndStatus(
        customerId,
        status,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async create(
    createDto: CreateCustomerSupportRequestDto,
  ): Promise<CustomerSupportRequestResponseDto> {
    const entity = await this.customerSupportRequestRepository.create(
      createDto.customerId,
      createDto.cargoId ?? null,
      createDto.requestType,
      createDto.subject ?? null,
      createDto.description,
      createDto.priority ?? SupportRequestPriority.MEDIUM,
      createDto.status ?? SupportRequestStatus.OPEN,
      createDto.assignedTo ?? null,
    );
    return this.mapToDto(entity);
  }

  async update(
    id: number,
    updateDto: UpdateCustomerSupportRequestDto,
  ): Promise<CustomerSupportRequestResponseDto> {
    const existing = await this.customerSupportRequestRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(
        `Customer support request with id ${id} not found`,
      );
    }

    let resolvedDate: Date | null = null;
    if (updateDto.status === SupportRequestStatus.RESOLVED || 
        updateDto.status === SupportRequestStatus.CLOSED) {
      if (!existing.resolved_date) {
        resolvedDate = new Date();
      }
    }

    const entity = await this.customerSupportRequestRepository.update(
      id,
      updateDto.requestType ?? null,
      updateDto.subject ?? null,
      updateDto.description ?? null,
      updateDto.priority ?? null,
      updateDto.status ?? null,
      updateDto.assignedTo ?? null,
      resolvedDate,
    );
    return this.mapToDto(entity);
  }

  async softDelete(id: number): Promise<void> {
    const existing = await this.customerSupportRequestRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(
        `Customer support request with id ${id} not found`,
      );
    }
    await this.customerSupportRequestRepository.softDelete(id);
  }
}

