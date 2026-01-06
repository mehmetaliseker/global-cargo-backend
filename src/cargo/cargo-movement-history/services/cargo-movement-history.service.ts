import { Injectable, NotFoundException } from '@nestjs/common';
import { CargoMovementHistoryRepository } from '../repositories/cargo-movement-history.repository';
import {
  CargoMovementHistoryResponseDto,
  LocationTypeEnum,
} from '../dto/cargo-movement-history.dto';
import { CargoMovementHistoryEntity } from '../repositories/cargo-movement-history.repository.interface';

@Injectable()
export class CargoMovementHistoryService {
  constructor(
    private readonly cargoMovementHistoryRepository: CargoMovementHistoryRepository,
  ) {}

  private mapToDto(
    entity: CargoMovementHistoryEntity,
  ): CargoMovementHistoryResponseDto {
    return {
      id: entity.id,
      cargoId: entity.cargo_id,
      locationType: entity.location_type as LocationTypeEnum,
      branchId: entity.branch_id,
      distributionCenterId: entity.distribution_center_id,
      movementDate: entity.movement_date.toISOString(),
      status: entity.status,
      description: entity.description,
      createdAt: entity.created_at.toISOString(),
    };
  }

  async findAll(): Promise<CargoMovementHistoryResponseDto[]> {
    const entities = await this.cargoMovementHistoryRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<CargoMovementHistoryResponseDto> {
    const entity = await this.cargoMovementHistoryRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Cargo movement history with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByCargoId(
    cargoId: number,
  ): Promise<CargoMovementHistoryResponseDto[]> {
    const entities =
      await this.cargoMovementHistoryRepository.findByCargoId(cargoId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCargoIdOrdered(
    cargoId: number,
  ): Promise<CargoMovementHistoryResponseDto[]> {
    const entities =
      await this.cargoMovementHistoryRepository.findByCargoIdOrdered(cargoId);
    return entities.map((entity) => this.mapToDto(entity));
  }
}

