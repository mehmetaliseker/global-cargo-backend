import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';

export class PaymentRefundResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  paymentId: number;

  @IsString()
  refundReason: string;

  @IsNumber()
  @Min(0.01)
  refundAmount: number;

  @IsString()
  refundStatus: string;

  @IsDateString()
  requestedDate: string;

  @IsOptional()
  @IsDateString()
  processedDate?: string;

  @IsOptional()
  @IsNumber()
  processedBy?: number;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

