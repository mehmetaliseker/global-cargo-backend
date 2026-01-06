import { Injectable, NotFoundException } from '@nestjs/common';
import { CargoEventLogRepository } from '../repositories/cargo-event-log.repository';
import { CargoEventLogResponseDto } from '../dto/cargo-event-log.dto';
import { CargoEventLogEntity } from '../repositories/cargo-event-log.repository.interface';

@Injectable()
export class CargoEventLogService {
  constructor(
    private readonly cargoEventLogRepository: CargoEventLogRepository,
  ) {}

  private mapToDto(entity: CargoEventLogEntity): CargoEventLogResponseDto {
    return {
      id: entity.id,
      cargoId: entity.cargo_id,
      eventType: entity.event_type,
      eventDescription: entity.event_description,
      eventTime: entity.event_time.toISOString(),
      locationId: entity.location_id,
      locationType: entity.location_type,
      employeeId: entity.employee_id,
      createdAt: entity.created_at.toISOString(),
    };
  }

  async findAll(): Promise<CargoEventLogResponseDto[]> {
    const entities = await this.cargoEventLogRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<CargoEventLogResponseDto> {
    const entity = await this.cargoEventLogRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Cargo event log with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByCargoId(cargoId: number): Promise<CargoEventLogResponseDto[]> {
    const entities = await this.cargoEventLogRepository.findByCargoId(cargoId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByEventType(eventType: string): Promise<CargoEventLogResponseDto[]> {
    const entities = await this.cargoEventLogRepository.findByEventType(eventType);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCargoIdOrdered(
    cargoId: number,
  ): Promise<CargoEventLogResponseDto[]> {
    const entities =
      await this.cargoEventLogRepository.findByCargoIdOrdered(cargoId);
    return entities.map((entity) => this.mapToDto(entity));
  }
}

