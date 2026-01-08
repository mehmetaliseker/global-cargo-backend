import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
  MaxLength,
} from 'class-validator';

export class EmployeeSalaryResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  employeeId: number;

  @IsNumber()
  @Min(0)
  baseSalary: number;

  @IsNumber()
  @Min(0)
  bonusAmount: number;

  @IsNumber()
  @Min(0)
  primAmount: number;

  @IsNumber()
  @Min(0)
  totalAmount: number;

  @IsNumber()
  currencyId: number;

  @IsDateString()
  periodStartDate: string;

  @IsOptional()
  @IsDateString()
  periodEndDate?: string;

  @IsOptional()
  @IsDateString()
  paymentDate?: string;

  @IsString()
  @MaxLength(50)
  status: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

export class CreateEmployeeSalaryDto {
  @IsNumber()
  @Min(1)
  employeeId: number;

  @IsNumber()
  @Min(0)
  baseSalary: number;

  @IsNumber()
  @Min(0)
  bonusAmount: number;

  @IsNumber()
  @Min(0)
  primAmount: number;

  @IsNumber()
  @Min(0.01)
  totalAmount: number;

  @IsNumber()
  @Min(1)
  currencyId: number;

  @IsDateString()
  periodStartDate: string;

  @IsOptional()
  @IsDateString()
  periodEndDate?: string;

  @IsOptional()
  @IsDateString()
  paymentDate?: string;

  @IsString()
  @MaxLength(50)
  status: string;
}

export class UpdateEmployeeSalaryDto {
  @IsNumber()
  @Min(0)
  baseSalary: number;

  @IsNumber()
  @Min(0)
  bonusAmount: number;

  @IsNumber()
  @Min(0)
  primAmount: number;

  @IsNumber()
  @Min(0.01)
  totalAmount: number;

  @IsOptional()
  @IsDateString()
  paymentDate?: string;

  @IsString()
  @MaxLength(50)
  status: string;
}

