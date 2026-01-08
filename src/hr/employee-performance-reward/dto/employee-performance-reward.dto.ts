import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
  MaxLength,
} from 'class-validator';

export class EmployeePerformanceRewardResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  employeeId: number;

  @IsString()
  @MaxLength(50)
  rewardType: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rewardAmount?: number;

  @IsOptional()
  @IsString()
  rewardDescription?: string;

  @IsOptional()
  @IsDateString()
  performancePeriodStart?: string;

  @IsOptional()
  @IsDateString()
  performancePeriodEnd?: string;

  @IsDateString()
  awardedDate: string;

  @IsOptional()
  @IsNumber()
  awardedBy?: number;

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

export class CreateEmployeePerformanceRewardDto {
  @IsNumber()
  employeeId: number;

  @IsString()
  @MaxLength(50)
  rewardType: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rewardAmount?: number;

  @IsOptional()
  @IsString()
  rewardDescription?: string;

  @IsOptional()
  @IsDateString()
  performancePeriodStart?: string;

  @IsOptional()
  @IsDateString()
  performancePeriodEnd?: string;

  @IsOptional()
  @IsNumber()
  awardedBy?: number;

  @IsString()
  @MaxLength(50)
  status: string;
}

export class UpdateEmployeePerformanceRewardDto {
  @IsString()
  @MaxLength(50)
  rewardType: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rewardAmount?: number;

  @IsOptional()
  @IsString()
  rewardDescription?: string;

  @IsOptional()
  @IsDateString()
  performancePeriodStart?: string;

  @IsOptional()
  @IsDateString()
  performancePeriodEnd?: string;

  @IsString()
  @MaxLength(50)
  status: string;
}

