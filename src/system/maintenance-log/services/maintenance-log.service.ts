import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { MaintenanceLogRepository } from '../repositories/maintenance-log.repository';
import { MaintenanceLogResponseDto } from '../dto/maintenance-log.dto';
import { MaintenanceLogEntity } from '../repositories/maintenance-log.repository.interface';

@Injectable()
export class MaintenanceLogService {
  constructor(
    private readonly maintenanceLogRepository: MaintenanceLogRepository,
  ) {}

  private mapToDto(entity: MaintenanceLogEntity): MaintenanceLogResponseDto {
    let details: Record<string, unknown> | undefined;
    if (entity.details) {
      if (typeof entity.details === 'string') {
        details = JSON.parse(entity.details);
      } else {
        details = entity.details as Record<string, unknown>;
      }
    }

    return {
      id: entity.id,
      maintenanceType: entity.maintenance_type,
      executionDate: entity.execution_date.toISOString(),
      status: entity.status,
      durationSeconds: entity.duration_seconds ?? undefined,
      details,
      executedBy: entity.executed_by ?? undefined,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
    };
  }

  async findAll(): Promise<MaintenanceLogResponseDto[]> {
    const entities = await this.maintenanceLogRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<MaintenanceLogResponseDto> {
    const entity = await this.maintenanceLogRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Maintenance log with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByMaintenanceType(
    maintenanceType: string,
  ): Promise<MaintenanceLogResponseDto[]> {
    const entities =
      await this.maintenanceLogRepository.findByMaintenanceType(maintenanceType);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByStatus(status: string): Promise<MaintenanceLogResponseDto[]> {
    const entities = await this.maintenanceLogRepository.findByStatus(status);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByExecutionDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<MaintenanceLogResponseDto[]> {
    if (startDate > endDate) {
      throw new BadRequestException('Start date must be before end date');
    }
    const entities =
      await this.maintenanceLogRepository.findByExecutionDateRange(
        startDate,
        endDate,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }
}
