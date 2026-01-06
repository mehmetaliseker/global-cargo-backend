import {
  IsString,
  IsBoolean,
  IsNumber,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class PartnerResponseDto {
  @IsNumber()
  id: number;

  @IsUUID()
  uuid: string;

  @IsNumber()
  actorId: number;

  @IsString()
  companyName: string;

  @IsOptional()
  @IsString()
  taxNumber?: string;

  @IsOptional()
  @IsNumber()
  countryId?: number;

  @IsBoolean()
  apiActive: boolean;

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

