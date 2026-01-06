import {
  IsString,
  IsBoolean,
  IsNumber,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class DistributionCenterResponseDto {
  @IsNumber()
  id: number;

  @IsUUID()
  uuid: string;

  @IsNumber()
  countryId: number;

  @IsOptional()
  @IsNumber()
  cityId?: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsBoolean()
  isActive: boolean;

  @IsBoolean()
  isTransferPoint: boolean;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsString()
  deletedAt?: string;
}

