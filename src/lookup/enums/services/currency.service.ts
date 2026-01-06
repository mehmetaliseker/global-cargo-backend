import { Injectable, NotFoundException } from '@nestjs/common';
import { CurrencyRepository } from '../repositories/currency.repository';
import { CurrencyResponseDto } from '../dto/currency.dto';
import { CurrencyEntity } from '../repositories/currency.repository.interface';

@Injectable()
export class CurrencyService {
  constructor(private readonly currencyRepository: CurrencyRepository) {}

  private mapToDto(entity: CurrencyEntity): CurrencyResponseDto {
    return {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      symbol: entity.symbol,
      isActive: entity.is_active,
      createdAt: entity.created_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<CurrencyResponseDto[]> {
    const entities = await this.currencyRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<CurrencyResponseDto> {
    const entity = await this.currencyRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Currency with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByCode(code: string): Promise<CurrencyResponseDto> {
    const entity = await this.currencyRepository.findByCode(code);
    if (!entity) {
      throw new NotFoundException(`Currency with code ${code} not found`);
    }
    return this.mapToDto(entity);
  }

  async findActive(): Promise<CurrencyResponseDto[]> {
    const entities = await this.currencyRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }
}

