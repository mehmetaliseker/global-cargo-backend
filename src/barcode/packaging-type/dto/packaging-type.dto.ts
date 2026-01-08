import {
  IsNumber,
  IsString,
  IsUUID,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class PackagingTypeResponseDto {
  @IsNumber()
  id: number;

  @IsUUID()
  uuid: string;

  @IsString()
  typeCode: string;

  @IsString()
  typeName: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  specialRequirements?: string;

  @IsNumber()
  costAdditional: number;

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
