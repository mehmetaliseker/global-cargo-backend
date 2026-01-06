import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class PaymentStatusResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  createdAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

