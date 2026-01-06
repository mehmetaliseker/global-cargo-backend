import { IsString, IsNumber, IsUUID, IsOptional, IsDateString, Min } from 'class-validator';

export class PricingCalculationResponseDto {
  @IsNumber()
  id: number;

  @IsUUID()
  uuid: string;

  @IsNumber()
  cargoId: number;

  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsNumber()
  @Min(0)
  shippingCost: number;

  @IsNumber()
  @Min(0)
  insuranceCost: number;

  @IsNumber()
  @Min(0)
  taxCost: number;

  @IsNumber()
  @Min(0)
  customsCost: number;

  @IsNumber()
  @Min(0)
  totalAmount: number;

  @IsNumber()
  currencyId: number;

  @IsNumber()
  shipmentTypeId: number;

  @IsDateString()
  calculationTimestamp: string;

  @IsOptional()
  @IsNumber()
  calculatedBy?: number;

  @IsString()
  createdAt: string;
}

