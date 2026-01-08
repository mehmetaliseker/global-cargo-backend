import {
  IsNumber,
  IsObject,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PartnerConfigResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  partnerId: number;

  @IsOptional()
  @IsObject()
  configData?: Record<string, unknown>;

  @IsOptional()
  @IsBoolean()
  hasApiKey?: boolean;

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

export class CreatePartnerConfigDto {
  @IsNumber()
  partnerId: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  configData?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  apiKey?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdatePartnerConfigDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  configData?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  apiKey?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

