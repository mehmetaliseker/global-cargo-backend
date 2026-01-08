import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
  MaxLength,
} from 'class-validator';

export class CargoCarbonDataResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  cargoId: number;

  @IsNumber()
  @Min(0)
  carbonFootprintValue: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  calculationMethod?: string;

  @IsOptional()
  @IsNumber()
  shipmentTypeId?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  distanceKm?: number;

  @IsDateString()
  calculationTimestamp: string;

  @IsString()
  createdAt: string;
}

export class CreateCargoCarbonDataDto {
  @IsNumber()
  @Min(1)
  cargoId: number;

  @IsNumber()
  @Min(0)
  carbonFootprintValue: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  calculationMethod?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  shipmentTypeId?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  distanceKm?: number;
}

export class UpdateCargoCarbonDataDto {
  @IsNumber()
  @Min(0)
  carbonFootprintValue: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  calculationMethod?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  shipmentTypeId?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  distanceKm?: number;
}

