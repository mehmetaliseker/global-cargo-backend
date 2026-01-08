import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CargoRouteAssignmentRepository } from '../repositories/cargo-route-assignment.repository';
import {
  CargoRouteAssignmentResponseDto,
  CreateCargoRouteAssignmentDto,
} from '../dto/cargo-route-assignment.dto';
import { CargoRouteAssignmentEntity } from '../repositories/cargo-route-assignment.repository.interface';

@Injectable()
export class CargoRouteAssignmentService {
  constructor(
    private readonly cargoRouteAssignmentRepository: CargoRouteAssignmentRepository,
  ) {}

  private mapToDto(
    entity: CargoRouteAssignmentEntity,
  ): CargoRouteAssignmentResponseDto {
    return {
      id: entity.id,
      cargoId: entity.cargo_id,
      routeId: entity.route_id,
      assignedDate: entity.assigned_date.toISOString(),
      assignedBy: entity.assigned_by ?? undefined,
      isActive: entity.is_active,
      createdAt: entity.created_at.toISOString(),
    };
  }

  async findAll(): Promise<CargoRouteAssignmentResponseDto[]> {
    const entities = await this.cargoRouteAssignmentRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<CargoRouteAssignmentResponseDto> {
    const entity = await this.cargoRouteAssignmentRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Cargo route assignment with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByCargoId(cargoId: number): Promise<CargoRouteAssignmentResponseDto | null> {
    const entity = await this.cargoRouteAssignmentRepository.findByCargoId(
      cargoId,
    );
    if (!entity) {
      return null;
    }
    return this.mapToDto(entity);
  }

  async findByCargoIdActive(cargoId: number): Promise<CargoRouteAssignmentResponseDto | null> {
    const entity = await this.cargoRouteAssignmentRepository.findByCargoIdActive(
      cargoId,
    );
    if (!entity) {
      return null;
    }
    return this.mapToDto(entity);
  }

  async findByRouteId(routeId: number): Promise<CargoRouteAssignmentResponseDto[]> {
    const entities = await this.cargoRouteAssignmentRepository.findByRouteId(
      routeId,
    );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByRouteIdActive(routeId: number): Promise<CargoRouteAssignmentResponseDto[]> {
    const entities =
      await this.cargoRouteAssignmentRepository.findByRouteIdActive(routeId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findActive(): Promise<CargoRouteAssignmentResponseDto[]> {
    const entities = await this.cargoRouteAssignmentRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async create(
    createDto: CreateCargoRouteAssignmentDto,
  ): Promise<CargoRouteAssignmentResponseDto> {
    const existing = await this.cargoRouteAssignmentRepository.findByCargoIdActive(
      createDto.cargoId,
    );
    if (existing) {
      throw new BadRequestException(
        `Active route assignment already exists for cargo ${createDto.cargoId}. The existing assignment will be deactivated and a new one will be created.`,
      );
    }

    const entity = await this.cargoRouteAssignmentRepository.create(
      createDto.cargoId,
      createDto.routeId,
      createDto.assignedBy ?? null,
    );

    return this.mapToDto(entity);
  }

  async deactivate(id: number): Promise<CargoRouteAssignmentResponseDto> {
    const existing = await this.cargoRouteAssignmentRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(
        `Cargo route assignment with id ${id} not found`,
      );
    }

    if (!existing.is_active) {
      throw new BadRequestException(
        `Cargo route assignment with id ${id} is already inactive`,
      );
    }

    const entity = await this.cargoRouteAssignmentRepository.deactivate(id);
    return this.mapToDto(entity);
  }
}

