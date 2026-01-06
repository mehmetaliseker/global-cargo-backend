import { Injectable, NotFoundException } from '@nestjs/common';
import { CargoDeliveryPreferenceRepository } from '../repositories/cargo-delivery-preference.repository';
import { CargoDeliveryPreferenceResponseDto } from '../dto/cargo-delivery-preference.dto';
import { CargoDeliveryPreferenceEntity } from '../repositories/cargo-delivery-preference.repository.interface';

@Injectable()
export class CargoDeliveryPreferenceService {
  constructor(
    private readonly cargoDeliveryPreferenceRepository: CargoDeliveryPreferenceRepository,
  ) {}

  private mapToDto(
    entity: CargoDeliveryPreferenceEntity,
  ): CargoDeliveryPreferenceResponseDto {
    return {
      id: entity.id,
      cargoId: entity.cargo_id,
      deliveryOptionId: entity.delivery_option_id,
      preferenceOrder: entity.preference_order,
      createdAt: entity.created_at.toISOString(),
    };
  }

  async findAll(): Promise<CargoDeliveryPreferenceResponseDto[]> {
    const entities = await this.cargoDeliveryPreferenceRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<CargoDeliveryPreferenceResponseDto> {
    const entity = await this.cargoDeliveryPreferenceRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Cargo delivery preference with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByCargoId(
    cargoId: number,
  ): Promise<CargoDeliveryPreferenceResponseDto[]> {
    const entities =
      await this.cargoDeliveryPreferenceRepository.findByCargoId(cargoId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByDeliveryOptionId(
    deliveryOptionId: number,
  ): Promise<CargoDeliveryPreferenceResponseDto[]> {
    const entities =
      await this.cargoDeliveryPreferenceRepository.findByDeliveryOptionId(
        deliveryOptionId,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }
}

