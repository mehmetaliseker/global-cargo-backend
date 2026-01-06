import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentStatusRepository } from '../repositories/payment-status.repository';
import { PaymentStatusResponseDto } from '../dto/payment-status.dto';
import { PaymentStatusEntity } from '../repositories/payment-status.repository.interface';

@Injectable()
export class PaymentStatusService {
  constructor(
    private readonly paymentStatusRepository: PaymentStatusRepository,
  ) {}

  private mapToDto(entity: PaymentStatusEntity): PaymentStatusResponseDto {
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

  async findAll(): Promise<PaymentStatusResponseDto[]> {
    const entities = await this.paymentStatusRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<PaymentStatusResponseDto> {
    const entity = await this.paymentStatusRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Payment status with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByCode(code: string): Promise<PaymentStatusResponseDto> {
    const entity = await this.paymentStatusRepository.findByCode(code);
    if (!entity) {
      throw new NotFoundException(
        `Payment status with code ${code} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findActive(): Promise<PaymentStatusResponseDto[]> {
    const entities = await this.paymentStatusRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }
}

