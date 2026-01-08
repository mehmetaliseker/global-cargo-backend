import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsObject,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CustomsDocumentTypeResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  requiredFields?: Record<string, unknown>;

  @IsBoolean()
  countrySpecific: boolean;

  @IsOptional()
  @IsNumber()
  countryId?: number;

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

export class CreateCustomsDocumentTypeDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  code: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  requiredFields?: Record<string, unknown>;

  @IsBoolean()
  countrySpecific: boolean;

  @IsOptional()
  @IsNumber()
  countryId?: number;
}

export class UpdateCustomsDocumentTypeDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  requiredFields?: Record<string, unknown>;

  @IsBoolean()
  isActive: boolean;
}

