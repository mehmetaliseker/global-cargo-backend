import {
  IsNumber,
  IsObject,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PartnerCountryMappingResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  partnerId: number;

  @IsNumber()
  countryId: number;

  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsObject()
  mappingData?: Record<string, unknown>;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

export class CreatePartnerCountryMappingDto {
  @IsNumber()
  partnerId: number;

  @IsNumber()
  countryId: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  mappingData?: Record<string, unknown>;
}

export class UpdatePartnerCountryMappingDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  mappingData?: Record<string, unknown>;
}

