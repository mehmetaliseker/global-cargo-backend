import {
  IsNumber,
  IsString,
  IsUUID,
  IsOptional,
  IsBoolean,
  IsEnum,
  Min,
  Max,
} from 'class-validator';

export enum LoyaltyTransactionType {
  EARNED = 'earned',
  REDEEMED = 'redeemed',
  EXPIRED = 'expired',
  ADJUSTED = 'adjusted',
}

export class LoyaltyTransactionResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  customerLoyaltyPointsId: number;

  @IsEnum(LoyaltyTransactionType)
  transactionType: string;

  @IsNumber()
  pointsAmount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  relatedEntityType?: string;

  @IsOptional()
  @IsNumber()
  relatedEntityId?: number;

  @IsString()
  transactionDate: string;

  @IsOptional()
  @IsString()
  expiryDate?: string;

  @IsString()
  createdAt: string;
}

export class CustomerReviewResponseDto {
  @IsNumber()
  id: number;

  @IsUUID()
  uuid: string;

  @IsNumber()
  customerId: number;

  @IsOptional()
  @IsNumber()
  cargoId?: number;

  @IsOptional()
  @IsString()
  reviewText?: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  overallRating: number;

  @IsString()
  reviewDate: string;

  @IsBoolean()
  isVerified: boolean;

  @IsBoolean()
  isPublished: boolean;

  @IsNumber()
  helpfulCount: number;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

export class ReviewRatingResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  customerReviewId: number;

  @IsString()
  ratingType: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  ratingValue: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsString()
  createdAt: string;
}

export class PaymentHistoryResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  customerId: number;

  @IsOptional()
  @IsNumber()
  paymentId?: number;

  @IsString()
  paymentDate: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  currencyId: number;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsBoolean()
  latePaymentFlag: boolean;

  @IsNumber()
  daysLate: number;

  @IsString()
  createdAt: string;
}
