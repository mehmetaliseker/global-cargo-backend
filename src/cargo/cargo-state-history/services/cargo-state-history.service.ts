import { Injectable, NotFoundException } from '@nestjs/common';
import { CargoStateHistoryRepository } from '../repositories/cargo-state-history.repository';
import { CargoStateHistoryResponseDto } from '../dto/cargo-state-history.dto';
import { CargoStateHistoryEntity } from '../repositories/cargo-state-history.repository.interface';

@Injectable()
export class CargoStateHistoryService {
  constructor(
    private readonly cargoStateHistoryRepository: CargoStateHistoryRepository,
  ) {}

  private mapToDto(
    entity: CargoStateHistoryEntity,
  ): CargoStateHistoryResponseDto {
    return {
      id: entity.id,
      cargoId: entity.cargo_id,
      stateId: entity.state_id,
      eventTime: entity.event_time.toISOString(),
      description: entity.description,
      changedBy: entity.changed_by,
      createdAt: entity.created_at.toISOString(),
    };
  }

  async findAll(): Promise<CargoStateHistoryResponseDto[]> {
    const entities = await this.cargoStateHistoryRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<CargoStateHistoryResponseDto> {
    const entity = await this.cargoStateHistoryRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Cargo state history with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByCargoId(cargoId: number): Promise<CargoStateHistoryResponseDto[]> {
    const entities =
      await this.cargoStateHistoryRepository.findByCargoId(cargoId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByStateId(stateId: number): Promise<CargoStateHistoryResponseDto[]> {
    const entities =
      await this.cargoStateHistoryRepository.findByStateId(stateId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCargoIdOrdered(
    cargoId: number,
  ): Promise<CargoStateHistoryResponseDto[]> {
    const entities =
      await this.cargoStateHistoryRepository.findByCargoIdOrdered(cargoId);
    return entities.map((entity) => this.mapToDto(entity));
  }
}

