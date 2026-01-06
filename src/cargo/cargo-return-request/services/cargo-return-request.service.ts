import { Injectable, NotFoundException } from '@nestjs/common';
import { CargoReturnRequestRepository } from '../repositories/cargo-return-request.repository';
import { CargoReturnRequestResponseDto } from '../dto/cargo-return-request.dto';
import { CargoReturnRequestEntity } from '../repositories/cargo-return-request.repository.interface';

@Injectable()
export class CargoReturnRequestService {
  constructor(
    private readonly cargoReturnRequestRepository: CargoReturnRequestRepository,
  ) {}

  private mapToDto(
    entity: CargoReturnRequestEntity,
  ): CargoReturnRequestResponseDto {
    return {
      id: entity.id,
      cargoId: entity.cargo_id,
      requestDate: entity.request_date.toISOString(),
      reason: entity.reason,
      status: entity.status,
      requestedBy: entity.requested_by,
      processedBy: entity.processed_by,
      processedDate: entity.processed_date?.toISOString(),
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<CargoReturnRequestResponseDto[]> {
    const entities = await this.cargoReturnRequestRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<CargoReturnRequestResponseDto> {
    const entity = await this.cargoReturnRequestRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Cargo return request with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByCargoId(cargoId: number): Promise<CargoReturnRequestResponseDto> {
    const entity =
      await this.cargoReturnRequestRepository.findByCargoId(cargoId);
    if (!entity) {
      throw new NotFoundException(
        `Cargo return request for cargo id ${cargoId} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByStatus(status: string): Promise<CargoReturnRequestResponseDto[]> {
    const entities = await this.cargoReturnRequestRepository.findByStatus(status);
    return entities.map((entity) => this.mapToDto(entity));
  }
}

