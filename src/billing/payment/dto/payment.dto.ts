import {
  IsString,
  IsNumber,
  IsUUID,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';

export class PaymentResponseDto {
  @IsNumber()
  id: number;

  @IsUUID()
  uuid: string;

  @IsNumber()
  invoiceId: number;

  @IsNumber()
  cargoId: number;

  @IsNumber()
  paymentMethodId: number;

  @IsNumber()
  paymentStatusId: number;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsNumber()
  currencyId: number;

  @IsOptional()
  @IsString()
  maskedCardNumber?: string;

  @IsOptional()
  @IsString()
  cardLastFour?: string;

  @IsOptional()
  @IsString()
  cardToken?: string;

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsDateString()
  transactionDate: string;

  @IsString()
  approvalStatus: string;

  @IsOptional()
  @IsDateString()
  approvedAt?: string;

  @IsOptional()
  @IsNumber()
  approvedBy?: number;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

