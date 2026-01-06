import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentMethodRepository } from '../repositories/payment-method.repository';
import { PaymentMethodResponseDto } from '../dto/payment-method.dto';
import { PaymentMethodEntity } from '../repositories/payment-method.repository.interface';

@Injectable()
export class PaymentMethodService {
  constructor(
    private readonly paymentMethodRepository: PaymentMethodRepository,
  ) {}

  private mapToDto(entity: PaymentMethodEntity): PaymentMethodResponseDto {
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

  async findAll(): Promise<PaymentMethodResponseDto[]> {
    const entities = await this.paymentMethodRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<PaymentMethodResponseDto> {
    const entity = await this.paymentMethodRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Payment method with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByCode(code: string): Promise<PaymentMethodResponseDto> {
    const entity = await this.paymentMethodRepository.findByCode(code);
    if (!entity) {
      throw new NotFoundException(
        `Payment method with code ${code} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findActive(): Promise<PaymentMethodResponseDto[]> {
    const entities = await this.paymentMethodRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }
}

