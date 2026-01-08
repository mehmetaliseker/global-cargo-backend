import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsObject,
  IsDateString,
  Min,
} from 'class-validator';

export class CargoCustomsDocumentResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  cargoId: number;

  @IsNumber()
  customsDocumentTypeId: number;

  @IsOptional()
  @IsString()
  documentNumber?: string;

  @IsOptional()
  @IsObject()
  documentData?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  fileReference?: string;

  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsBoolean()
  isVerified: boolean;

  @IsOptional()
  @IsNumber()
  verifiedBy?: number;

  @IsOptional()
  @IsDateString()
  verifiedAt?: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

export class CreateCargoCustomsDocumentDto {
  @IsNumber()
  @Min(1)
  cargoId: number;

  @IsNumber()
  @Min(1)
  customsDocumentTypeId: number;

  @IsOptional()
  @IsString()
  documentNumber?: string;

  @IsOptional()
  @IsObject()
  documentData?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  fileReference?: string;

  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;
}

export class UpdateCargoCustomsDocumentDto {
  @IsOptional()
  @IsString()
  documentNumber?: string;

  @IsOptional()
  @IsObject()
  documentData?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  fileReference?: string;

  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;
}

export class VerifyCargoCustomsDocumentDto {
  @IsNumber()
  @Min(1)
  verifiedBy: number;
}

