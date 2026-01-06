import { IsString, IsBoolean, IsNumber, IsUUID } from 'class-validator';

export class CountryResponseDto {
  @IsNumber()
  id: number;

  @IsUUID()
  uuid: string;

  @IsString()
  isoCode: string;

  @IsString()
  isoCode2: string;

  @IsString()
  name: string;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsString()
  deletedAt?: string;
}

