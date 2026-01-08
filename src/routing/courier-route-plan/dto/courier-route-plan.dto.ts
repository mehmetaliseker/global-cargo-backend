import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
  MaxLength,
  IsInt,
} from 'class-validator';

export class CourierRoutePlanResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  employeeId: number;

  @IsNumber()
  routeId: number;

  @IsDateString()
  planDate: string;

  @IsString()
  @MaxLength(50)
  status: string;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsInt()
  @Min(0)
  totalCargoCount: number;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

export class CreateCourierRoutePlanDto {
  @IsNumber()
  @Min(1)
  employeeId: number;

  @IsNumber()
  @Min(1)
  routeId: number;

  @IsDateString()
  planDate: string;

  @IsString()
  @MaxLength(50)
  status: string;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsInt()
  @Min(0)
  totalCargoCount: number;
}

export class UpdateCourierRoutePlanDto {
  @IsString()
  @MaxLength(50)
  status: string;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsInt()
  @Min(0)
  totalCargoCount: number;
}

