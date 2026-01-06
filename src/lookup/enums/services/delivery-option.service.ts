import { Injectable, NotFoundException } from '@nestjs/common';
import { DeliveryOptionRepository } from '../repositories/delivery-option.repository';
import { DeliveryOptionResponseDto } from '../dto/delivery-option.dto';
import { DeliveryOptionEntity } from '../repositories/delivery-option.repository.interface';

@Injectable()
export class DeliveryOptionService {
  constructor(
    private readonly deliveryOptionRepository: DeliveryOptionRepository,
  ) {}

  private mapToDto(entity: DeliveryOptionEntity): DeliveryOptionResponseDto {
    return {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      description: entity.description,
      isActive: entity.is_active,
      createdAt: entity.created_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<DeliveryOptionResponseDto[]> {
    const entities = await this.deliveryOptionRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<DeliveryOptionResponseDto> {
    const entity = await this.deliveryOptionRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Delivery option with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByCode(code: string): Promise<DeliveryOptionResponseDto> {
    const entity = await this.deliveryOptionRepository.findByCode(code);
    if (!entity) {
      throw new NotFoundException(
        `Delivery option with code ${code} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findActive(): Promise<DeliveryOptionResponseDto[]> {
    const entities = await this.deliveryOptionRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }
}

