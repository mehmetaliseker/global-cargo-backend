import {
  IsNumber,
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  MaxLength,
  MinLength,
} from 'class-validator';

export enum SupportRequestPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum SupportRequestStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  WAITING_CUSTOMER = 'waiting_customer',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export class CustomerSupportRequestResponseDto {
  @IsNumber()
  id: number;

  @IsUUID()
  uuid: string;

  @IsNumber()
  customerId: number;

  @IsOptional()
  @IsNumber()
  cargoId?: number;

  @IsString()
  requestType: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsString()
  description: string;

  @IsEnum(SupportRequestPriority)
  priority: string;

  @IsEnum(SupportRequestStatus)
  status: string;

  @IsOptional()
  @IsNumber()
  assignedTo?: number;

  @IsString()
  requestedDate: string;

  @IsOptional()
  @IsString()
  resolvedDate?: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

export class CreateCustomerSupportRequestDto {
  @IsNumber()
  customerId: number;

  @IsOptional()
  @IsNumber()
  cargoId?: number;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  requestType: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  subject?: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsOptional()
  @IsEnum(SupportRequestPriority)
  priority?: string;

  @IsOptional()
  @IsEnum(SupportRequestStatus)
  status?: string;

  @IsOptional()
  @IsNumber()
  assignedTo?: number;
}

export class UpdateCustomerSupportRequestDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  requestType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  subject?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  description?: string;

  @IsOptional()
  @IsEnum(SupportRequestPriority)
  priority?: string;

  @IsOptional()
  @IsEnum(SupportRequestStatus)
  status?: string;

  @IsOptional()
  @IsNumber()
  assignedTo?: number;
}

