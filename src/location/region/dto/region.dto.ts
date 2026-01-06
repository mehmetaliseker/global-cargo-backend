import { IsString, IsBoolean, IsNumber, IsUUID, IsOptional } from 'class-validator';

export class RegionResponseDto {
  @IsNumber()
  id: number;

  @IsUUID()
  uuid: string;

  @IsNumber()
  countryId: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsString()
  deletedAt?: string;
}

