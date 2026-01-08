import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsObject,
  IsDateString,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CargoInsuranceResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  cargoId: number;

  @IsString()
  insurancePolicyNumber: string;

  @IsNumber()
  @Min(0)
  insuredValue: number;

  @IsNumber()
  @Min(0)
  premiumAmount: number;

  @IsNumber()
  currencyId: number;

  @IsOptional()
  @IsString()
  coverageType?: string;

  @IsOptional()
  @IsObject()
  policyData?: Record<string, unknown>;

  @IsDateString()
  issueDate: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  createdAt: string;
}

export class CreateCargoInsuranceDto {
  @IsNumber()
  @Min(1)
  cargoId: number;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  insurancePolicyNumber: string;

  @IsNumber()
  @Min(0.01)
  insuredValue: number;

  @IsNumber()
  @Min(0)
  premiumAmount: number;

  @IsNumber()
  @Min(1)
  currencyId: number;

  @IsOptional()
  @IsString()
  coverageType?: string;

  @IsOptional()
  @IsObject()
  policyData?: Record<string, unknown>;

  @IsDateString()
  issueDate: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;
}

export class UpdateCargoInsuranceDto {
  @IsNumber()
  @Min(0.01)
  insuredValue: number;

  @IsNumber()
  @Min(0)
  premiumAmount: number;

  @IsOptional()
  @IsString()
  coverageType?: string;

  @IsOptional()
  @IsObject()
  policyData?: Record<string, unknown>;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsBoolean()
  isActive: boolean;
}

export class ActivateCargoInsuranceDto {
  @IsBoolean()
  isActive: boolean;
}

