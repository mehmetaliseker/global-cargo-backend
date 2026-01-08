import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EmployeeLeaveRequestRepository } from '../repositories/employee-leave-request.repository';
import {
  EmployeeLeaveRequestResponseDto,
  CreateEmployeeLeaveRequestDto,
  UpdateEmployeeLeaveRequestDto,
} from '../dto/employee-leave-request.dto';
import { EmployeeLeaveRequestEntity } from '../repositories/employee-leave-request.repository.interface';

@Injectable()
export class EmployeeLeaveRequestService {
  constructor(
    private readonly employeeLeaveRequestRepository: EmployeeLeaveRequestRepository,
  ) {}

  private mapToDto(
    entity: EmployeeLeaveRequestEntity,
  ): EmployeeLeaveRequestResponseDto {
    return {
      id: entity.id,
      employeeId: entity.employee_id,
      leaveType: entity.leave_type,
      startDate: entity.start_date.toISOString(),
      endDate: entity.end_date.toISOString(),
      totalDays: entity.total_days,
      reason: entity.reason ?? undefined,
      status: entity.status,
      requestedDate: entity.requested_date.toISOString(),
      approvedDate: entity.approved_date?.toISOString(),
      approverId: entity.approver_id ?? undefined,
      rejectionReason: entity.rejection_reason ?? undefined,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<EmployeeLeaveRequestResponseDto[]> {
    const entities = await this.employeeLeaveRequestRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<EmployeeLeaveRequestResponseDto> {
    const entity = await this.employeeLeaveRequestRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Employee leave request with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByEmployeeId(
    employeeId: number,
  ): Promise<EmployeeLeaveRequestResponseDto[]> {
    const entities =
      await this.employeeLeaveRequestRepository.findByEmployeeId(employeeId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByStatus(status: string): Promise<EmployeeLeaveRequestResponseDto[]> {
    const entities = await this.employeeLeaveRequestRepository.findByStatus(
      status,
    );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByLeaveType(
    leaveType: string,
  ): Promise<EmployeeLeaveRequestResponseDto[]> {
    const entities =
      await this.employeeLeaveRequestRepository.findByLeaveType(leaveType);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByEmployeeIdAndStatus(
    employeeId: number,
    status: string,
  ): Promise<EmployeeLeaveRequestResponseDto[]> {
    const entities =
      await this.employeeLeaveRequestRepository.findByEmployeeIdAndStatus(
        employeeId,
        status,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<EmployeeLeaveRequestResponseDto[]> {
    const entities =
      await this.employeeLeaveRequestRepository.findByDateRange(
        startDate,
        endDate,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async create(
    createDto: CreateEmployeeLeaveRequestDto,
  ): Promise<EmployeeLeaveRequestResponseDto> {
    const start = new Date(createDto.startDate);
    const end = new Date(createDto.endDate);

    if (end < start) {
      throw new BadRequestException(
        'End date cannot be before start date',
      );
    }

    const entity = await this.employeeLeaveRequestRepository.create(
      createDto.employeeId,
      createDto.leaveType,
      start,
      end,
      createDto.reason ?? null,
      createDto.status,
    );

    return this.mapToDto(entity);
  }

  async update(
    id: number,
    updateDto: UpdateEmployeeLeaveRequestDto,
  ): Promise<EmployeeLeaveRequestResponseDto> {
    const existing = await this.employeeLeaveRequestRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(
        `Employee leave request with id ${id} not found`,
      );
    }

    if (updateDto.status === 'approved' && !updateDto.approverId) {
      throw new BadRequestException(
        'Approver ID is required when approving leave request',
      );
    }

    if (updateDto.status === 'rejected' && !updateDto.rejectionReason) {
      throw new BadRequestException(
        'Rejection reason is required when rejecting leave request',
      );
    }

    if (updateDto.status === 'approved' && existing.status !== 'pending') {
      throw new BadRequestException(
        'Only pending leave requests can be approved',
      );
    }

    if (updateDto.status === 'rejected' && existing.status !== 'pending') {
      throw new BadRequestException(
        'Only pending leave requests can be rejected',
      );
    }

    const approvedDate =
      updateDto.status === 'approved'
        ? updateDto.approvedDate
          ? new Date(updateDto.approvedDate)
          : new Date()
        : null;

    const entity = await this.employeeLeaveRequestRepository.update(
      id,
      updateDto.status,
      approvedDate,
      updateDto.approverId ?? null,
      updateDto.rejectionReason ?? null,
    );

    return this.mapToDto(entity);
  }

  async delete(id: number): Promise<void> {
    const existing = await this.employeeLeaveRequestRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(
        `Employee leave request with id ${id} not found`,
      );
    }

    await this.employeeLeaveRequestRepository.softDelete(id);
  }
}

