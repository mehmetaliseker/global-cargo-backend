import {
  IsString,
  IsNumber,
  IsUUID,
  IsOptional,
  IsBoolean,
  IsDateString,
  Min,
} from 'class-validator';

export class CargoResponseDto {
  @IsNumber()
  id: number;

  @IsUUID()
  uuid: string;

  @IsString()
  trackingNumber: string;

  @IsOptional()
  @IsString()
  deliveryNumber?: string;

  @IsNumber()
  customerId: number;

  @IsOptional()
  @IsNumber()
  originBranchId?: number;

  @IsOptional()
  @IsNumber()
  destinationBranchId?: number;

  @IsNumber()
  originCountryId: number;

  @IsNumber()
  destinationCountryId: number;

  @IsDateString()
  originDate: string;

  @IsOptional()
  @IsDateString()
  estimatedDeliveryDate?: string;

  @IsOptional()
  @IsDateString()
  actualDeliveryDate?: string;

  @IsNumber()
  cargoTypeId: number;

  @IsNumber()
  shipmentTypeId: number;

  @IsNumber()
  @Min(0.001)
  weightKg: number;

  @IsOptional()
  @IsNumber()
  lengthCm?: number;

  @IsOptional()
  @IsNumber()
  widthCm?: number;

  @IsOptional()
  @IsNumber()
  heightCm?: number;

  @IsOptional()
  @IsNumber()
  volumetricWeightKg?: number;

  @IsOptional()
  @IsNumber()
  valueDeclaration?: number;

  @IsNumber()
  currencyId: number;

  @IsOptional()
  @IsNumber()
  currentStateId?: number;

  @IsNumber()
  undeliveredCancelThresholdHours: number;

  @IsBoolean()
  isAutoCancelled: boolean;

  @IsOptional()
  @IsDateString()
  autoCancelDate?: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

