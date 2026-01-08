import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CargoCarbonDataRepository } from '../repositories/cargo-carbon-data.repository';
import {
  CargoCarbonDataResponseDto,
  CreateCargoCarbonDataDto,
  UpdateCargoCarbonDataDto,
} from '../dto/cargo-carbon-data.dto';
import { CargoCarbonDataEntity } from '../repositories/cargo-carbon-data.repository.interface';

@Injectable()
export class CargoCarbonDataService {
  constructor(
    private readonly cargoCarbonDataRepository: CargoCarbonDataRepository,
  ) {}

  private mapToDto(entity: CargoCarbonDataEntity): CargoCarbonDataResponseDto {
    return {
      id: entity.id,
      cargoId: entity.cargo_id,
      carbonFootprintValue: parseFloat(entity.carbon_footprint_value.toString()),
      calculationMethod: entity.calculation_method ?? undefined,
      shipmentTypeId: entity.shipment_type_id ?? undefined,
      distanceKm: entity.distance_km
        ? parseFloat(entity.distance_km.toString())
        : undefined,
      calculationTimestamp: entity.calculation_timestamp.toISOString(),
      createdAt: entity.created_at.toISOString(),
    };
  }

  async findAll(): Promise<CargoCarbonDataResponseDto[]> {
    const entities = await this.cargoCarbonDataRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<CargoCarbonDataResponseDto> {
    const entity = await this.cargoCarbonDataRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Cargo carbon data with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByCargoId(cargoId: number): Promise<CargoCarbonDataResponseDto | null> {
    const entity = await this.cargoCarbonDataRepository.findByCargoId(cargoId);
    if (!entity) {
      return null;
    }
    return this.mapToDto(entity);
  }

  async findByShipmentTypeId(
    shipmentTypeId: number,
  ): Promise<CargoCarbonDataResponseDto[]> {
    const entities =
      await this.cargoCarbonDataRepository.findByShipmentTypeId(shipmentTypeId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async create(
    createDto: CreateCargoCarbonDataDto,
  ): Promise<CargoCarbonDataResponseDto> {
    const existing = await this.cargoCarbonDataRepository.findByCargoId(
      createDto.cargoId,
    );
    if (existing) {
      throw new BadRequestException(
        `Carbon data already exists for cargo ${createDto.cargoId}`,
      );
    }

    const entity = await this.cargoCarbonDataRepository.create(
      createDto.cargoId,
      createDto.carbonFootprintValue,
      createDto.calculationMethod ?? null,
      createDto.shipmentTypeId ?? null,
      createDto.distanceKm ?? null,
    );

    return this.mapToDto(entity);
  }

  async update(
    id: number,
    updateDto: UpdateCargoCarbonDataDto,
  ): Promise<CargoCarbonDataResponseDto> {
    const existing = await this.cargoCarbonDataRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Cargo carbon data with id ${id} not found`);
    }

    const entity = await this.cargoCarbonDataRepository.update(
      id,
      updateDto.carbonFootprintValue,
      updateDto.calculationMethod ?? null,
      updateDto.shipmentTypeId ?? null,
      updateDto.distanceKm ?? null,
    );

    return this.mapToDto(entity);
  }
}

