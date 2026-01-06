import {
  IsString,
  IsBoolean,
  IsNumber,
  IsUUID,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';

export class InvoiceResponseDto {
  @IsNumber()
  id: number;

  @IsUUID()
  uuid: string;

  @IsNumber()
  cargoId: number;

  @IsString()
  invoiceNumber: string;

  @IsDateString()
  invoiceDate: string;

  @IsBoolean()
  isMainInvoice: boolean;

  @IsBoolean()
  isAdditionalInvoice: boolean;

  @IsOptional()
  @IsString()
  invoiceType?: string;

  @IsNumber()
  @Min(0)
  subtotal: number;

  @IsNumber()
  @Min(0)
  taxAmount: number;

  @IsNumber()
  @Min(0)
  discountAmount: number;

  @IsNumber()
  @Min(0)
  totalAmount: number;

  @IsNumber()
  currencyId: number;

  @IsOptional()
  @IsNumber()
  institutionAgreementId?: number;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

