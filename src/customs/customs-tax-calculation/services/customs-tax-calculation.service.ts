import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CustomsTaxCalculationRepository } from '../repositories/customs-tax-calculation.repository';
import {
  CustomsTaxCalculationResponseDto,
  CreateCustomsTaxCalculationDto,
} from '../dto/customs-tax-calculation.dto';
import { CustomsTaxCalculationEntity } from '../repositories/customs-tax-calculation.repository.interface';

@Injectable()
export class CustomsTaxCalculationService {
  constructor(
    private readonly customsTaxCalculationRepository: CustomsTaxCalculationRepository,
  ) {}

  private mapToDto(
    entity: CustomsTaxCalculationEntity,
  ): CustomsTaxCalculationResponseDto {
    return {
      id: entity.id,
      cargoId: entity.cargo_id,
      countryId: entity.country_id,
      shipmentTypeId: entity.shipment_type_id,
      customsDutyAmount: parseFloat(entity.customs_duty_amount.toString()),
      vatAmount: parseFloat(entity.vat_amount.toString()),
      additionalTaxAmount: parseFloat(entity.additional_tax_amount.toString()),
      totalTaxAmount: parseFloat(entity.total_tax_amount.toString()),
      currencyId: entity.currency_id,
      taxRegulationVersionId: entity.tax_regulation_version_id ?? undefined,
      calculationDate: entity.calculation_date.toISOString(),
      countryRiskId: entity.country_risk_id ?? undefined,
      riskCheckPassed: entity.risk_check_passed,
      createdAt: entity.created_at.toISOString(),
    };
  }

  async findAll(): Promise<CustomsTaxCalculationResponseDto[]> {
    const entities =
      await this.customsTaxCalculationRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<CustomsTaxCalculationResponseDto> {
    const entity = await this.customsTaxCalculationRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Customs tax calculation with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByCargoId(
    cargoId: number,
  ): Promise<CustomsTaxCalculationResponseDto[]> {
    const entities =
      await this.customsTaxCalculationRepository.findByCargoId(cargoId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCargoIdLatest(
    cargoId: number,
  ): Promise<CustomsTaxCalculationResponseDto | null> {
    const entity =
      await this.customsTaxCalculationRepository.findByCargoIdLatest(cargoId);
    if (!entity) {
      return null;
    }
    return this.mapToDto(entity);
  }

  async findByCountryId(
    countryId: number,
  ): Promise<CustomsTaxCalculationResponseDto[]> {
    const entities =
      await this.customsTaxCalculationRepository.findByCountryId(countryId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCountryIdAndDateRange(
    countryId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<CustomsTaxCalculationResponseDto[]> {
    const entities =
      await this.customsTaxCalculationRepository.findByCountryIdAndDateRange(
        countryId,
        startDate,
        endDate,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCalculationDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<CustomsTaxCalculationResponseDto[]> {
    const entities =
      await this.customsTaxCalculationRepository.findByCalculationDateRange(
        startDate,
        endDate,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByRiskCheckPassed(
    riskCheckPassed: boolean,
  ): Promise<CustomsTaxCalculationResponseDto[]> {
    const entities =
      await this.customsTaxCalculationRepository.findByRiskCheckPassed(
        riskCheckPassed,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async create(
    createDto: CreateCustomsTaxCalculationDto,
  ): Promise<CustomsTaxCalculationResponseDto> {
    const calculatedTotal =
      createDto.customsDutyAmount +
      createDto.vatAmount +
      createDto.additionalTaxAmount;

    const tolerance = 0.01;
    if (
      Math.abs(calculatedTotal - createDto.totalTaxAmount) > tolerance
    ) {
      throw new BadRequestException(
        `Total tax amount (${createDto.totalTaxAmount}) must equal the sum of customs duty (${createDto.customsDutyAmount}), VAT (${createDto.vatAmount}), and additional tax (${createDto.additionalTaxAmount})`,
      );
    }

    const entity = await this.customsTaxCalculationRepository.create(
      createDto.cargoId,
      createDto.countryId,
      createDto.shipmentTypeId,
      createDto.customsDutyAmount,
      createDto.vatAmount,
      createDto.additionalTaxAmount,
      createDto.totalTaxAmount,
      createDto.currencyId,
      createDto.taxRegulationVersionId ?? null,
      createDto.countryRiskId ?? null,
      createDto.riskCheckPassed,
    );

    return this.mapToDto(entity);
  }
}

