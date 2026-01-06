import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CurrencyResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  symbol?: string;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  createdAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

