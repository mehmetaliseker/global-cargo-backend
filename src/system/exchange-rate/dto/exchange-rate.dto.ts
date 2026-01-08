import {
  IsNumber,
  IsString,
  IsBoolean,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';

export class ExchangeRateResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  fromCurrencyId: number;

  @IsNumber()
  toCurrencyId: number;

  @IsNumber()
  @Min(0)
  rateValue: number;

  @IsDateString()
  effectiveDate: string;

  @IsDateString()
  timestamp: string;

  @IsOptional()
  @IsString()
  source?: string;

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
