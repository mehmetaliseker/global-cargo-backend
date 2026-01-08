import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
  MaxLength,
} from 'class-validator';

export class HrKpiResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  employeeId: number;

  @IsString()
  @MaxLength(50)
  kpiType: string;

  @IsNumber()
  kpiValue: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  kpiPeriod?: string;

  @IsOptional()
  @IsDateString()
  periodStartDate?: string;

  @IsOptional()
  @IsDateString()
  periodEndDate?: string;

  @IsDateString()
  calculationDate: string;

  @IsOptional()
  @IsNumber()
  calculatedBy?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

export class CreateHrKpiDto {
  @IsNumber()
  @Min(1)
  employeeId: number;

  @IsString()
  @MaxLength(50)
  kpiType: string;

  @IsNumber()
  kpiValue: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  kpiPeriod?: string;

  @IsOptional()
  @IsDateString()
  periodStartDate?: string;

  @IsOptional()
  @IsDateString()
  periodEndDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  calculatedBy?: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateHrKpiDto {
  @IsNumber()
  kpiValue: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  kpiPeriod?: string;

  @IsOptional()
  @IsDateString()
  periodStartDate?: string;

  @IsOptional()
  @IsDateString()
  periodEndDate?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

