import {
  IsNumber,
  IsString,
  IsObject,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class AuditLogResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  tableName: string;

  @IsNumber()
  recordId: number;

  @IsOptional()
  @IsString()
  recordUuid?: string;

  @IsString()
  action: string;

  @IsOptional()
  @IsObject()
  oldValues?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  newValues?: Record<string, unknown>;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsString()
  userType?: string;

  @IsOptional()
  @IsString()
  serviceName?: string;

  @IsOptional()
  @IsString()
  requestId?: string;

  @IsOptional()
  @IsString()
  correlationId?: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsDateString()
  timestamp: string;

  @IsDateString()
  createdAt: string;
}

export class AuditLogQueryDto {
  @IsOptional()
  @IsString()
  tableName?: string;

  @IsOptional()
  @IsNumber()
  recordId?: number;

  @IsOptional()
  @IsString()
  recordUuid?: string;

  @IsOptional()
  @IsString()
  action?: string;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsString()
  requestId?: string;

  @IsOptional()
  @IsString()
  correlationId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
