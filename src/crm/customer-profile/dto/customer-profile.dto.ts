import {
  IsNumber,
  IsString,
  IsUUID,
  IsOptional,
  IsBoolean,
  IsObject,
} from 'class-validator';

export class LoyaltyProgramResponseDto {
  @IsNumber()
  id: number;

  @IsUUID()
  uuid: string;

  @IsString()
  programName: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  pointConversionRate: number;

  @IsOptional()
  @IsObject()
  tierLevels?: Record<string, unknown>;

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

export class CustomerLoyaltyPointsResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  customerId: number;

  @IsNumber()
  loyaltyProgramId: number;

  @IsNumber()
  totalPoints: number;

  @IsNumber()
  availablePoints: number;

  @IsNumber()
  expiredPoints: number;

  @IsOptional()
  @IsString()
  currentTier?: string;

  @IsString()
  lastUpdatedAt: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}

export class CustomerCreditLimitResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  customerId: number;

  @IsNumber()
  creditLimitAmount: number;

  @IsNumber()
  usedAmount: number;

  @IsNumber()
  availableAmount: number;

  @IsNumber()
  currencyId: number;

  @IsString()
  lastUpdatedAt: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}
