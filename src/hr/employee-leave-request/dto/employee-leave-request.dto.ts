import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  MaxLength,
  IsInt,
} from 'class-validator';

export class EmployeeLeaveRequestResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  employeeId: number;

  @IsString()
  @MaxLength(50)
  leaveType: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsInt()
  totalDays: number;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsString()
  @MaxLength(50)
  status: string;

  @IsDateString()
  requestedDate: string;

  @IsOptional()
  @IsDateString()
  approvedDate?: string;

  @IsOptional()
  @IsNumber()
  approverId?: number;

  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

export class CreateEmployeeLeaveRequestDto {
  @IsNumber()
  employeeId: number;

  @IsString()
  @MaxLength(50)
  leaveType: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsString()
  @MaxLength(50)
  status: string;
}

export class UpdateEmployeeLeaveRequestDto {
  @IsString()
  @MaxLength(50)
  status: string;

  @IsOptional()
  @IsDateString()
  approvedDate?: string;

  @IsOptional()
  @IsNumber()
  approverId?: number;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

