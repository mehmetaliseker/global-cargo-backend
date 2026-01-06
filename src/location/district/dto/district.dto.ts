import { IsString, IsBoolean, IsNumber, IsUUID, IsOptional } from 'class-validator';

export class DistrictResponseDto {
  @IsNumber()
  id: number;

  @IsUUID()
  uuid: string;

  @IsNumber()
  cityId: number;

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

