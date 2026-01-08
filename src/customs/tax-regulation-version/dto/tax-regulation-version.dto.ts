import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsObject,
  IsDateString,
  Min,
  Max,
} from 'class-validator';

export class TaxRegulationVersionResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  countryId: number;

  @IsNumber()
  year: number;

  @IsObject()
  regulationData: Record<string, unknown>;

  @IsDateString()
  effectiveFrom: string;

  @IsOptional()
  @IsDateString()
  effectiveTo?: string;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

export class CreateTaxRegulationVersionDto {
  @IsNumber()
  @Min(1)
  countryId: number;

  @IsNumber()
  @Min(2000)
  @Max(2100)
  year: number;

  @IsObject()
  regulationData: Record<string, unknown>;

  @IsDateString()
  effectiveFrom: string;

  @IsOptional()
  @IsDateString()
  effectiveTo?: string;
}

export class UpdateTaxRegulationVersionDto {
  @IsObject()
  regulationData: Record<string, unknown>;

  @IsDateString()
  effectiveFrom: string;

  @IsOptional()
  @IsDateString()
  effectiveTo?: string;

  @IsBoolean()
  isActive: boolean;
}

