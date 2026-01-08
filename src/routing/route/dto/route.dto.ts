import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsUUID,
  IsInt,
  Min,
  MaxLength,
} from 'class-validator';

export class RouteResponseDto {
  @IsNumber()
  id: number;

  @IsUUID()
  uuid: string;

  @IsNumber()
  originDistributionCenterId: number;

  @IsNumber()
  destinationDistributionCenterId: number;

  @IsNumber()
  shipmentTypeId: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  routeCode?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  estimatedDurationHours?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  distanceKm?: number;

  @IsBoolean()
  isAlternativeRoute: boolean;

  @IsOptional()
  @IsNumber()
  mainRouteId?: number;

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

export class CreateRouteDto {
  @IsNumber()
  @Min(1)
  originDistributionCenterId: number;

  @IsNumber()
  @Min(1)
  destinationDistributionCenterId: number;

  @IsNumber()
  @Min(1)
  shipmentTypeId: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  routeCode?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  estimatedDurationHours?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  distanceKm?: number;

  @IsBoolean()
  isAlternativeRoute: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  mainRouteId?: number;
}

export class UpdateRouteDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  routeCode?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  estimatedDurationHours?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  distanceKm?: number;

  @IsBoolean()
  isActive: boolean;
}

