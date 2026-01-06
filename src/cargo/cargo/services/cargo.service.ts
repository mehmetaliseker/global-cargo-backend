import { Injectable, NotFoundException } from '@nestjs/common';
import { CargoRepository } from '../repositories/cargo.repository';
import { CargoResponseDto } from '../dto/cargo.dto';
import { CargoEntity } from '../repositories/cargo.repository.interface';

@Injectable()
export class CargoService {
  constructor(private readonly cargoRepository: CargoRepository) {}

  private mapToDto(entity: CargoEntity): CargoResponseDto {
    return {
      id: entity.id,
      uuid: entity.uuid,
      trackingNumber: entity.tracking_number,
      deliveryNumber: entity.delivery_number,
      customerId: entity.customer_id,
      originBranchId: entity.origin_branch_id,
      destinationBranchId: entity.destination_branch_id,
      originCountryId: entity.origin_country_id,
      destinationCountryId: entity.destination_country_id,
      originDate: entity.origin_date.toISOString(),
      estimatedDeliveryDate: entity.estimated_delivery_date?.toISOString(),
      actualDeliveryDate: entity.actual_delivery_date?.toISOString(),
      cargoTypeId: entity.cargo_type_id,
      shipmentTypeId: entity.shipment_type_id,
      weightKg: parseFloat(entity.weight_kg.toString()),
      lengthCm: entity.length_cm ? parseFloat(entity.length_cm.toString()) : undefined,
      widthCm: entity.width_cm ? parseFloat(entity.width_cm.toString()) : undefined,
      heightCm: entity.height_cm ? parseFloat(entity.height_cm.toString()) : undefined,
      volumetricWeightKg: entity.volumetric_weight_kg
        ? parseFloat(entity.volumetric_weight_kg.toString())
        : undefined,
      valueDeclaration: entity.value_declaration
        ? parseFloat(entity.value_declaration.toString())
        : undefined,
      currencyId: entity.currency_id,
      currentStateId: entity.current_state_id,
      undeliveredCancelThresholdHours: entity.undelivered_cancel_threshold_hours,
      isAutoCancelled: entity.is_auto_cancelled,
      autoCancelDate: entity.auto_cancel_date?.toISOString(),
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<CargoResponseDto[]> {
    const entities = await this.cargoRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<CargoResponseDto> {
    const entity = await this.cargoRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Cargo with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<CargoResponseDto> {
    const entity = await this.cargoRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(`Cargo with uuid ${uuid} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByTrackingNumber(trackingNumber: string): Promise<CargoResponseDto> {
    const entity =
      await this.cargoRepository.findByTrackingNumber(trackingNumber);
    if (!entity) {
      throw new NotFoundException(
        `Cargo with tracking number ${trackingNumber} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByDeliveryNumber(deliveryNumber: string): Promise<CargoResponseDto> {
    const entity =
      await this.cargoRepository.findByDeliveryNumber(deliveryNumber);
    if (!entity) {
      throw new NotFoundException(
        `Cargo with delivery number ${deliveryNumber} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByCustomerId(customerId: number): Promise<CargoResponseDto[]> {
    const entities = await this.cargoRepository.findByCustomerId(customerId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByOriginCountryId(
    originCountryId: number,
  ): Promise<CargoResponseDto[]> {
    const entities =
      await this.cargoRepository.findByOriginCountryId(originCountryId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByDestinationCountryId(
    destinationCountryId: number,
  ): Promise<CargoResponseDto[]> {
    const entities =
      await this.cargoRepository.findByDestinationCountryId(
        destinationCountryId,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCurrentStateId(stateId: number): Promise<CargoResponseDto[]> {
    const entities = await this.cargoRepository.findByCurrentStateId(stateId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByEstimatedDeliveryDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<CargoResponseDto[]> {
    const entities =
      await this.cargoRepository.findByEstimatedDeliveryDateRange(
        startDate,
        endDate,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }
}

