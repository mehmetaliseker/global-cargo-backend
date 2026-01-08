import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CargoInsuranceRepository } from '../repositories/cargo-insurance.repository';
import {
  CargoInsuranceResponseDto,
  CreateCargoInsuranceDto,
  UpdateCargoInsuranceDto,
  ActivateCargoInsuranceDto,
} from '../dto/cargo-insurance.dto';
import { CargoInsuranceEntity } from '../repositories/cargo-insurance.repository.interface';

@Injectable()
export class CargoInsuranceService {
  constructor(
    private readonly cargoInsuranceRepository: CargoInsuranceRepository,
  ) {}

  private mapToDto(entity: CargoInsuranceEntity): CargoInsuranceResponseDto {
    let policyData: Record<string, unknown> | undefined;
    if (entity.policy_data) {
      if (typeof entity.policy_data === 'string') {
        policyData = JSON.parse(entity.policy_data);
      } else {
        policyData = entity.policy_data as Record<string, unknown>;
      }
    }

    return {
      id: entity.id,
      cargoId: entity.cargo_id,
      insurancePolicyNumber: entity.insurance_policy_number,
      insuredValue: parseFloat(entity.insured_value.toString()),
      premiumAmount: parseFloat(entity.premium_amount.toString()),
      currencyId: entity.currency_id,
      coverageType: entity.coverage_type ?? undefined,
      policyData,
      issueDate: entity.issue_date.toISOString(),
      expiryDate: entity.expiry_date?.toISOString(),
      isActive: entity.is_active,
      createdAt: entity.created_at.toISOString(),
    };
  }

  async findAll(): Promise<CargoInsuranceResponseDto[]> {
    const entities = await this.cargoInsuranceRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<CargoInsuranceResponseDto> {
    const entity = await this.cargoInsuranceRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Cargo insurance with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByCargoId(cargoId: number): Promise<CargoInsuranceResponseDto | null> {
    const entity = await this.cargoInsuranceRepository.findByCargoId(cargoId);
    if (!entity) {
      return null;
    }
    return this.mapToDto(entity);
  }

  async findByPolicyNumber(
    policyNumber: string,
  ): Promise<CargoInsuranceResponseDto> {
    const entity =
      await this.cargoInsuranceRepository.findByPolicyNumber(policyNumber);
    if (!entity) {
      throw new NotFoundException(
        `Cargo insurance with policy number ${policyNumber} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findActive(): Promise<CargoInsuranceResponseDto[]> {
    const entities = await this.cargoInsuranceRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByActiveStatus(isActive: boolean): Promise<CargoInsuranceResponseDto[]> {
    const entities =
      await this.cargoInsuranceRepository.findByActiveStatus(isActive);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async create(
    createDto: CreateCargoInsuranceDto,
  ): Promise<CargoInsuranceResponseDto> {
    const existing = await this.cargoInsuranceRepository.findByCargoId(
      createDto.cargoId,
    );
    if (existing) {
      throw new BadRequestException(
        `Insurance already exists for cargo ${createDto.cargoId}`,
      );
    }

    const existingPolicy = await this.cargoInsuranceRepository.findByPolicyNumber(
      createDto.insurancePolicyNumber,
    );
    if (existingPolicy) {
      throw new BadRequestException(
        `Insurance policy number ${createDto.insurancePolicyNumber} already exists`,
      );
    }

    if (createDto.expiryDate && createDto.issueDate) {
      const expiry = new Date(createDto.expiryDate);
      const issue = new Date(createDto.issueDate);
      if (expiry < issue) {
        throw new BadRequestException(
          'Expiry date cannot be before issue date',
        );
      }
    }

    const entity = await this.cargoInsuranceRepository.create(
      createDto.cargoId,
      createDto.insurancePolicyNumber,
      createDto.insuredValue,
      createDto.premiumAmount,
      createDto.currencyId,
      createDto.coverageType ?? null,
      createDto.policyData ?? null,
      new Date(createDto.issueDate),
      createDto.expiryDate ? new Date(createDto.expiryDate) : null,
    );

    return this.mapToDto(entity);
  }

  async update(
    id: number,
    updateDto: UpdateCargoInsuranceDto,
  ): Promise<CargoInsuranceResponseDto> {
    // Migration 014: cargo_insurance tablosunda UPDATE işlemi trigger ile engellenmiştir
    throw new BadRequestException(
      'Update operation is not allowed on cargo insurance records. Insurance records are immutable.',
    );
  }

  async activate(
    id: number,
    activateDto: ActivateCargoInsuranceDto,
  ): Promise<CargoInsuranceResponseDto> {
    // Migration 014: cargo_insurance tablosunda UPDATE işlemi trigger ile engellenmiştir
    throw new BadRequestException(
      'Activate/deactivate operation is not allowed on cargo insurance records. Insurance records are immutable.',
    );
  }
}

