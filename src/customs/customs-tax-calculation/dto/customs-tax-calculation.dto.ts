import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';

export class CustomsTaxCalculationResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  cargoId: number;

  @IsNumber()
  countryId: number;

  @IsNumber()
  shipmentTypeId: number;

  @IsNumber()
  @Min(0)
  customsDutyAmount: number;

  @IsNumber()
  @Min(0)
  vatAmount: number;

  @IsNumber()
  @Min(0)
  additionalTaxAmount: number;

  @IsNumber()
  @Min(0)
  totalTaxAmount: number;

  @IsNumber()
  currencyId: number;

  @IsOptional()
  @IsNumber()
  taxRegulationVersionId?: number;

  @IsDateString()
  calculationDate: string;

  @IsOptional()
  @IsNumber()
  countryRiskId?: number;

  @IsBoolean()
  riskCheckPassed: boolean;

  @IsString()
  createdAt: string;
}

export class CreateCustomsTaxCalculationDto {
  @IsNumber()
  @Min(1)
  cargoId: number;

  @IsNumber()
  @Min(1)
  countryId: number;

  @IsNumber()
  @Min(1)
  shipmentTypeId: number;

  @IsNumber()
  @Min(0)
  customsDutyAmount: number;

  @IsNumber()
  @Min(0)
  vatAmount: number;

  @IsNumber()
  @Min(0)
  additionalTaxAmount: number;

  @IsNumber()
  @Min(0)
  totalTaxAmount: number;

  @IsNumber()
  @Min(1)
  currencyId: number;

  @IsOptional()
  @IsNumber()
  taxRegulationVersionId?: number;

  @IsOptional()
  @IsNumber()
  countryRiskId?: number;

  @IsBoolean()
  riskCheckPassed: boolean;
}

