import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CustomerSupportResponseRepository } from '../repositories/customer-support-response.repository';
import { CustomerSupportRequestRepository } from '../../customer-support-request/repositories/customer-support-request.repository';
import {
  CustomerSupportResponseResponseDto,
  CreateCustomerSupportResponseDto,
} from '../dto/customer-support-response.dto';
import { CustomerSupportResponseEntity } from '../repositories/customer-support-response.repository.interface';

@Injectable()
export class CustomerSupportResponseService {
  constructor(
    private readonly customerSupportResponseRepository: CustomerSupportResponseRepository,
    private readonly customerSupportRequestRepository: CustomerSupportRequestRepository,
  ) {}

  private mapToDto(
    entity: CustomerSupportResponseEntity,
  ): CustomerSupportResponseResponseDto {
    return {
      id: entity.id,
      supportRequestId: entity.support_request_id,
      employeeId: entity.employee_id ?? undefined,
      responseContent: entity.response_content,
      isResolution: entity.is_resolution,
      responseDate: entity.response_date.toISOString(),
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<CustomerSupportResponseResponseDto[]> {
    const entities = await this.customerSupportResponseRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(
    id: number,
  ): Promise<CustomerSupportResponseResponseDto> {
    const entity = await this.customerSupportResponseRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Customer support response with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findBySupportRequestId(
    supportRequestId: number,
  ): Promise<CustomerSupportResponseResponseDto[]> {
    const supportRequest =
      await this.customerSupportRequestRepository.findById(supportRequestId);
    if (!supportRequest) {
      throw new NotFoundException(
        `Customer support request with id ${supportRequestId} not found`,
      );
    }

    const entities =
      await this.customerSupportResponseRepository.findBySupportRequestId(
        supportRequestId,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByEmployeeId(
    employeeId: number,
  ): Promise<CustomerSupportResponseResponseDto[]> {
    const entities =
      await this.customerSupportResponseRepository.findByEmployeeId(employeeId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findResolutions(
    supportRequestId: number,
  ): Promise<CustomerSupportResponseResponseDto[]> {
    const supportRequest =
      await this.customerSupportRequestRepository.findById(supportRequestId);
    if (!supportRequest) {
      throw new NotFoundException(
        `Customer support request with id ${supportRequestId} not found`,
      );
    }

    const entities =
      await this.customerSupportResponseRepository.findResolutions(
        supportRequestId,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async create(
    createDto: CreateCustomerSupportResponseDto,
  ): Promise<CustomerSupportResponseResponseDto> {
    const supportRequest =
      await this.customerSupportRequestRepository.findById(
        createDto.supportRequestId,
      );
    if (!supportRequest) {
      throw new NotFoundException(
        `Customer support request with id ${createDto.supportRequestId} not found`,
      );
    }

    if (!createDto.employeeId && !createDto.isResolution) {
      throw new BadRequestException(
        'Either employeeId must be provided or isResolution must be false for customer responses',
      );
    }

    const entity = await this.customerSupportResponseRepository.create(
      createDto.supportRequestId,
      createDto.employeeId ?? null,
      createDto.responseContent,
      createDto.isResolution ?? false,
    );

    return this.mapToDto(entity);
  }

  async softDelete(id: number): Promise<void> {
    const existing = await this.customerSupportResponseRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(
        `Customer support response with id ${id} not found`,
      );
    }
    await this.customerSupportResponseRepository.softDelete(id);
  }
}

