import {
  IsNumber,
  IsString,
  IsBoolean,
  IsOptional,
  MinLength,
} from 'class-validator';

export class CustomerSupportResponseResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  supportRequestId: number;

  @IsOptional()
  @IsNumber()
  employeeId?: number;

  @IsString()
  responseContent: string;

  @IsBoolean()
  isResolution: boolean;

  @IsString()
  responseDate: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

export class CreateCustomerSupportResponseDto {
  @IsNumber()
  supportRequestId: number;

  @IsOptional()
  @IsNumber()
  employeeId?: number;

  @IsString()
  @MinLength(1)
  responseContent: string;

  @IsOptional()
  @IsBoolean()
  isResolution?: boolean;
}

