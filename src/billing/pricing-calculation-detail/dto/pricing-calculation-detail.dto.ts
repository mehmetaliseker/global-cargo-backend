import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class PricingCalculationDetailResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  pricingCalculationId: number;

  @IsString()
  costType: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  calculationFactor?: Record<string, unknown>;

  @IsString()
  createdAt: string;
}

