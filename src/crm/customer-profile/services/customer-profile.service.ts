import { Injectable, NotFoundException } from '@nestjs/common';
import { LoyaltyProgramRepository } from '../repositories/customer-profile.repository';
import { CustomerLoyaltyPointsRepository } from '../repositories/customer-profile.repository';
import { CustomerCreditLimitRepository } from '../repositories/customer-profile.repository';
import {
  LoyaltyProgramResponseDto,
  CustomerLoyaltyPointsResponseDto,
  CustomerCreditLimitResponseDto,
} from '../dto/customer-profile.dto';
import {
  LoyaltyProgramEntity,
  CustomerLoyaltyPointsEntity,
  CustomerCreditLimitEntity,
} from '../repositories/customer-profile.repository.interface';

@Injectable()
export class LoyaltyProgramService {
  constructor(
    private readonly loyaltyProgramRepository: LoyaltyProgramRepository,
  ) {}

  private mapToDto(entity: LoyaltyProgramEntity): LoyaltyProgramResponseDto {
    let tierLevels: Record<string, unknown> | undefined = undefined;
    if (entity.tier_levels) {
      if (typeof entity.tier_levels === 'string') {
        tierLevels = JSON.parse(entity.tier_levels);
      } else {
        tierLevels = entity.tier_levels as Record<string, unknown>;
      }
    }

    return {
      id: entity.id,
      uuid: entity.uuid,
      programName: entity.program_name,
      description: entity.description ?? undefined,
      pointConversionRate: parseFloat(entity.point_conversion_rate.toString()),
      tierLevels,
      isActive: entity.is_active,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<LoyaltyProgramResponseDto[]> {
    const entities = await this.loyaltyProgramRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<LoyaltyProgramResponseDto> {
    const entity = await this.loyaltyProgramRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Loyalty program with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<LoyaltyProgramResponseDto> {
    const entity = await this.loyaltyProgramRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(
        `Loyalty program with uuid ${uuid} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findActive(): Promise<LoyaltyProgramResponseDto[]> {
    const entities = await this.loyaltyProgramRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }
}

@Injectable()
export class CustomerLoyaltyPointsService {
  constructor(
    private readonly customerLoyaltyPointsRepository: CustomerLoyaltyPointsRepository,
  ) {}

  private mapToDto(
    entity: CustomerLoyaltyPointsEntity,
  ): CustomerLoyaltyPointsResponseDto {
    return {
      id: entity.id,
      customerId: entity.customer_id,
      loyaltyProgramId: entity.loyalty_program_id,
      totalPoints: parseFloat(entity.total_points.toString()),
      availablePoints: parseFloat(entity.available_points.toString()),
      expiredPoints: parseFloat(entity.expired_points.toString()),
      currentTier: entity.current_tier ?? undefined,
      lastUpdatedAt: entity.last_updated_at.toISOString(),
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
    };
  }

  async findAll(): Promise<CustomerLoyaltyPointsResponseDto[]> {
    const entities = await this.customerLoyaltyPointsRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<CustomerLoyaltyPointsResponseDto> {
    const entity = await this.customerLoyaltyPointsRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Customer loyalty points with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByCustomerId(
    customerId: number,
  ): Promise<CustomerLoyaltyPointsResponseDto> {
    const entity =
      await this.customerLoyaltyPointsRepository.findByCustomerId(customerId);
    if (!entity) {
      throw new NotFoundException(
        `Customer loyalty points for customer ${customerId} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByLoyaltyProgramId(
    loyaltyProgramId: number,
  ): Promise<CustomerLoyaltyPointsResponseDto[]> {
    const entities =
      await this.customerLoyaltyPointsRepository.findByLoyaltyProgramId(
        loyaltyProgramId,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }
}

@Injectable()
export class CustomerCreditLimitService {
  constructor(
    private readonly customerCreditLimitRepository: CustomerCreditLimitRepository,
  ) {}

  private mapToDto(
    entity: CustomerCreditLimitEntity,
  ): CustomerCreditLimitResponseDto {
    return {
      id: entity.id,
      customerId: entity.customer_id,
      creditLimitAmount: parseFloat(entity.credit_limit_amount.toString()),
      usedAmount: parseFloat(entity.used_amount.toString()),
      availableAmount: parseFloat(entity.available_amount.toString()),
      currencyId: entity.currency_id,
      lastUpdatedAt: entity.last_updated_at.toISOString(),
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
    };
  }

  async findAll(): Promise<CustomerCreditLimitResponseDto[]> {
    const entities = await this.customerCreditLimitRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<CustomerCreditLimitResponseDto> {
    const entity = await this.customerCreditLimitRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Customer credit limit with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByCustomerId(
    customerId: number,
  ): Promise<CustomerCreditLimitResponseDto> {
    const entity =
      await this.customerCreditLimitRepository.findByCustomerId(customerId);
    if (!entity) {
      throw new NotFoundException(
        `Customer credit limit for customer ${customerId} not found`,
      );
    }
    return this.mapToDto(entity);
  }
}
