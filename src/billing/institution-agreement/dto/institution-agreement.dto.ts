import {
  IsString,
  IsBoolean,
  IsNumber,
  IsUUID,
  IsOptional,
  IsDateString,
  Min,
  Max,
} from 'class-validator';

export class InstitutionAgreementResponseDto {
  @IsNumber()
  id: number;

  @IsUUID()
  uuid: string;

  @IsString()
  institutionName: string;

  @IsOptional()
  @IsString()
  institutionCode?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercentage: number;

  @IsDateString()
  validFrom: string;

  @IsOptional()
  @IsDateString()
  validTo?: string;

  @IsBoolean()
  isActive: boolean;

  @IsBoolean()
  autoApply: boolean;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

