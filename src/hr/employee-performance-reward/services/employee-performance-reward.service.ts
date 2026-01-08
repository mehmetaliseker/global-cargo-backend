import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EmployeePerformanceRewardRepository } from '../repositories/employee-performance-reward.repository';
import {
  EmployeePerformanceRewardResponseDto,
  CreateEmployeePerformanceRewardDto,
  UpdateEmployeePerformanceRewardDto,
} from '../dto/employee-performance-reward.dto';
import { EmployeePerformanceRewardEntity } from '../repositories/employee-performance-reward.repository.interface';

@Injectable()
export class EmployeePerformanceRewardService {
  constructor(
    private readonly employeePerformanceRewardRepository: EmployeePerformanceRewardRepository,
  ) {}

  private mapToDto(
    entity: EmployeePerformanceRewardEntity,
  ): EmployeePerformanceRewardResponseDto {
    return {
      id: entity.id,
      employeeId: entity.employee_id,
      rewardType: entity.reward_type,
      rewardAmount: entity.reward_amount
        ? parseFloat(entity.reward_amount.toString())
        : undefined,
      rewardDescription: entity.reward_description ?? undefined,
      performancePeriodStart:
        entity.performance_period_start?.toISOString(),
      performancePeriodEnd: entity.performance_period_end?.toISOString(),
      awardedDate: entity.awarded_date.toISOString(),
      awardedBy: entity.awarded_by ?? undefined,
      status: entity.status,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<EmployeePerformanceRewardResponseDto[]> {
    const entities =
      await this.employeePerformanceRewardRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<EmployeePerformanceRewardResponseDto> {
    const entity = await this.employeePerformanceRewardRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Employee performance reward with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByEmployeeId(
    employeeId: number,
  ): Promise<EmployeePerformanceRewardResponseDto[]> {
    const entities =
      await this.employeePerformanceRewardRepository.findByEmployeeId(
        employeeId,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByRewardType(
    rewardType: string,
  ): Promise<EmployeePerformanceRewardResponseDto[]> {
    const entities =
      await this.employeePerformanceRewardRepository.findByRewardType(
        rewardType,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByStatus(status: string): Promise<EmployeePerformanceRewardResponseDto[]> {
    const entities =
      await this.employeePerformanceRewardRepository.findByStatus(status);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByEmployeeIdAndStatus(
    employeeId: number,
    status: string,
  ): Promise<EmployeePerformanceRewardResponseDto[]> {
    const entities =
      await this.employeePerformanceRewardRepository.findByEmployeeIdAndStatus(
        employeeId,
        status,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByPerformancePeriod(
    periodStart: Date,
    periodEnd: Date,
  ): Promise<EmployeePerformanceRewardResponseDto[]> {
    const entities =
      await this.employeePerformanceRewardRepository.findByPerformancePeriod(
        periodStart,
        periodEnd,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async create(
    createDto: CreateEmployeePerformanceRewardDto,
  ): Promise<EmployeePerformanceRewardResponseDto> {
    if (
      createDto.performancePeriodEnd &&
      createDto.performancePeriodStart
    ) {
      const end = new Date(createDto.performancePeriodEnd);
      const start = new Date(createDto.performancePeriodStart);
      if (end < start) {
        throw new BadRequestException(
          'Performance period end date cannot be before start date',
        );
      }
    }

    const entity = await this.employeePerformanceRewardRepository.create(
      createDto.employeeId,
      createDto.rewardType,
      createDto.rewardAmount ?? null,
      createDto.rewardDescription ?? null,
      createDto.performancePeriodStart
        ? new Date(createDto.performancePeriodStart)
        : null,
      createDto.performancePeriodEnd
        ? new Date(createDto.performancePeriodEnd)
        : null,
      createDto.awardedBy ?? null,
      createDto.status,
    );

    return this.mapToDto(entity);
  }

  async update(
    id: number,
    updateDto: UpdateEmployeePerformanceRewardDto,
  ): Promise<EmployeePerformanceRewardResponseDto> {
    const existing =
      await this.employeePerformanceRewardRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(
        `Employee performance reward with id ${id} not found`,
      );
    }

    if (
      updateDto.performancePeriodEnd &&
      updateDto.performancePeriodStart
    ) {
      const end = new Date(updateDto.performancePeriodEnd);
      const start = new Date(updateDto.performancePeriodStart);
      if (end < start) {
        throw new BadRequestException(
          'Performance period end date cannot be before start date',
        );
      }
    }

    const entity = await this.employeePerformanceRewardRepository.update(
      id,
      updateDto.rewardType,
      updateDto.rewardAmount ?? null,
      updateDto.rewardDescription ?? null,
      updateDto.performancePeriodStart
        ? new Date(updateDto.performancePeriodStart)
        : null,
      updateDto.performancePeriodEnd
        ? new Date(updateDto.performancePeriodEnd)
        : null,
      updateDto.status,
    );

    return this.mapToDto(entity);
  }

  async delete(id: number): Promise<void> {
    const existing =
      await this.employeePerformanceRewardRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(
        `Employee performance reward with id ${id} not found`,
      );
    }

    await this.employeePerformanceRewardRepository.softDelete(id);
  }
}

