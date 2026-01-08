import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CourierRoutePlanRepository } from '../repositories/courier-route-plan.repository';
import {
  CourierRoutePlanResponseDto,
  CreateCourierRoutePlanDto,
  UpdateCourierRoutePlanDto,
} from '../dto/courier-route-plan.dto';
import { CourierRoutePlanEntity } from '../repositories/courier-route-plan.repository.interface';

@Injectable()
export class CourierRoutePlanService {
  constructor(
    private readonly courierRoutePlanRepository: CourierRoutePlanRepository,
  ) {}

  private mapToDto(entity: CourierRoutePlanEntity): CourierRoutePlanResponseDto {
    return {
      id: entity.id,
      employeeId: entity.employee_id,
      routeId: entity.route_id,
      planDate: entity.plan_date.toISOString(),
      status: entity.status,
      startTime: entity.start_time?.toISOString(),
      endTime: entity.end_time?.toISOString(),
      totalCargoCount: entity.total_cargo_count,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<CourierRoutePlanResponseDto[]> {
    const entities = await this.courierRoutePlanRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<CourierRoutePlanResponseDto> {
    const entity = await this.courierRoutePlanRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Courier route plan with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByEmployeeId(employeeId: number): Promise<CourierRoutePlanResponseDto[]> {
    const entities = await this.courierRoutePlanRepository.findByEmployeeId(
      employeeId,
    );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByRouteId(routeId: number): Promise<CourierRoutePlanResponseDto[]> {
    const entities = await this.courierRoutePlanRepository.findByRouteId(
      routeId,
    );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByPlanDate(planDate: Date): Promise<CourierRoutePlanResponseDto[]> {
    const entities = await this.courierRoutePlanRepository.findByPlanDate(
      planDate,
    );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByStatus(status: string): Promise<CourierRoutePlanResponseDto[]> {
    const entities = await this.courierRoutePlanRepository.findByStatus(status);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByEmployeeIdAndDate(
    employeeId: number,
    planDate: Date,
  ): Promise<CourierRoutePlanResponseDto[]> {
    const entities =
      await this.courierRoutePlanRepository.findByEmployeeIdAndDate(
        employeeId,
        planDate,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async create(
    createDto: CreateCourierRoutePlanDto,
  ): Promise<CourierRoutePlanResponseDto> {
    if (createDto.endTime && createDto.startTime) {
      const end = new Date(createDto.endTime);
      const start = new Date(createDto.startTime);
      if (end < start) {
        throw new BadRequestException(
          'End time cannot be before start time',
        );
      }
    }

    const entity = await this.courierRoutePlanRepository.create(
      createDto.employeeId,
      createDto.routeId,
      new Date(createDto.planDate),
      createDto.status,
      createDto.startTime ? new Date(createDto.startTime) : null,
      createDto.endTime ? new Date(createDto.endTime) : null,
      createDto.totalCargoCount,
    );

    return this.mapToDto(entity);
  }

  async update(
    id: number,
    updateDto: UpdateCourierRoutePlanDto,
  ): Promise<CourierRoutePlanResponseDto> {
    const existing = await this.courierRoutePlanRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(
        `Courier route plan with id ${id} not found`,
      );
    }

    if (updateDto.endTime && updateDto.startTime) {
      const end = new Date(updateDto.endTime);
      const start = new Date(updateDto.startTime);
      if (end < start) {
        throw new BadRequestException(
          'End time cannot be before start time',
        );
      }
    }

    const entity = await this.courierRoutePlanRepository.update(
      id,
      updateDto.status,
      updateDto.startTime ? new Date(updateDto.startTime) : null,
      updateDto.endTime ? new Date(updateDto.endTime) : null,
      updateDto.totalCargoCount,
    );

    return this.mapToDto(entity);
  }
}

