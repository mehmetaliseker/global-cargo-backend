import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { HrKpiRepository } from '../repositories/hr-kpi.repository';
import {
  HrKpiResponseDto,
  CreateHrKpiDto,
  UpdateHrKpiDto,
} from '../dto/hr-kpi.dto';
import { HrKpiEntity } from '../repositories/hr-kpi.repository.interface';

@Injectable()
export class HrKpiService {
  constructor(private readonly hrKpiRepository: HrKpiRepository) {}

  private mapToDto(entity: HrKpiEntity): HrKpiResponseDto {
    return {
      id: entity.id,
      employeeId: entity.employee_id,
      kpiType: entity.kpi_type,
      kpiValue: parseFloat(entity.kpi_value.toString()),
      kpiPeriod: entity.kpi_period ?? undefined,
      periodStartDate: entity.period_start_date?.toISOString(),
      periodEndDate: entity.period_end_date?.toISOString(),
      calculationDate: entity.calculation_date.toISOString(),
      calculatedBy: entity.calculated_by ?? undefined,
      description: entity.description ?? undefined,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<HrKpiResponseDto[]> {
    const entities = await this.hrKpiRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<HrKpiResponseDto> {
    const entity = await this.hrKpiRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`HR KPI with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByEmployeeId(employeeId: number): Promise<HrKpiResponseDto[]> {
    const entities = await this.hrKpiRepository.findByEmployeeId(employeeId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByKpiType(kpiType: string): Promise<HrKpiResponseDto[]> {
    const entities = await this.hrKpiRepository.findByKpiType(kpiType);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByEmployeeIdAndKpiType(
    employeeId: number,
    kpiType: string,
  ): Promise<HrKpiResponseDto[]> {
    const entities = await this.hrKpiRepository.findByEmployeeIdAndKpiType(
      employeeId,
      kpiType,
    );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByPeriod(
    periodStartDate: Date,
    periodEndDate: Date,
  ): Promise<HrKpiResponseDto[]> {
    const entities = await this.hrKpiRepository.findByPeriod(
      periodStartDate,
      periodEndDate,
    );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async create(createDto: CreateHrKpiDto): Promise<HrKpiResponseDto> {
    if (createDto.periodEndDate && createDto.periodStartDate) {
      const end = new Date(createDto.periodEndDate);
      const start = new Date(createDto.periodStartDate);
      if (end < start) {
        throw new BadRequestException(
          'Period end date cannot be before period start date',
        );
      }
    }

    const entity = await this.hrKpiRepository.create(
      createDto.employeeId,
      createDto.kpiType,
      createDto.kpiValue,
      createDto.kpiPeriod ?? null,
      createDto.periodStartDate ? new Date(createDto.periodStartDate) : null,
      createDto.periodEndDate ? new Date(createDto.periodEndDate) : null,
      createDto.calculatedBy ?? null,
      createDto.description ?? null,
    );

    return this.mapToDto(entity);
  }

  async update(id: number, updateDto: UpdateHrKpiDto): Promise<HrKpiResponseDto> {
    const existing = await this.hrKpiRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`HR KPI with id ${id} not found`);
    }

    if (updateDto.periodEndDate && updateDto.periodStartDate) {
      const end = new Date(updateDto.periodEndDate);
      const start = new Date(updateDto.periodStartDate);
      if (end < start) {
        throw new BadRequestException(
          'Period end date cannot be before period start date',
        );
      }
    }

    const entity = await this.hrKpiRepository.update(
      id,
      updateDto.kpiValue,
      updateDto.kpiPeriod ?? null,
      updateDto.periodStartDate ? new Date(updateDto.periodStartDate) : null,
      updateDto.periodEndDate ? new Date(updateDto.periodEndDate) : null,
      updateDto.description ?? null,
    );

    return this.mapToDto(entity);
  }

  async delete(id: number): Promise<void> {
    const existing = await this.hrKpiRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`HR KPI with id ${id} not found`);
    }

    await this.hrKpiRepository.softDelete(id);
  }
}

