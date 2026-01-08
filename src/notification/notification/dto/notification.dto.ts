import {
  IsNumber,
  IsString,
  IsUUID,
  IsOptional,
  IsObject,
  IsEnum,
  Min,
  Max,
} from 'class-validator';

export enum NotificationStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
}

export enum AlertSeverityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum AlertLogStatus {
  PENDING = 'pending',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed',
}

export class NotificationQueueResponseDto {
  @IsNumber()
  id: number;

  @IsUUID()
  uuid: string;

  @IsOptional()
  @IsNumber()
  notificationTemplateId?: number;

  @IsString()
  recipientType: string;

  @IsNumber()
  recipientId: number;

  @IsObject()
  notificationData: Record<string, unknown>;

  @IsNumber()
  @Min(1)
  @Max(10)
  priority: number;

  @IsString()
  scheduledTime: string;

  @IsEnum(NotificationStatus)
  status: string;

  @IsNumber()
  retryCount: number;

  @IsNumber()
  maxRetries: number;

  @IsOptional()
  @IsString()
  sentAt?: string;

  @IsOptional()
  @IsString()
  deliveredAt?: string;

  @IsOptional()
  @IsString()
  errorMessage?: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}

export class AlertRuleResponseDto {
  @IsNumber()
  id: number;

  @IsUUID()
  uuid: string;

  @IsString()
  alertName: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsObject()
  triggerConditions: Record<string, unknown>;

  @IsEnum(AlertSeverityLevel)
  severityLevel: string;

  @IsOptional()
  @IsNumber()
  notificationTemplateId?: number;

  @IsString()
  isActive: boolean;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

export class AlertLogResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  alertRuleId: number;

  @IsString()
  entityType: string;

  @IsNumber()
  entityId: number;

  @IsOptional()
  @IsObject()
  alertData?: Record<string, unknown>;

  @IsEnum(AlertLogStatus)
  status: string;

  @IsOptional()
  @IsString()
  resolvedAt?: string;

  @IsOptional()
  @IsNumber()
  resolvedBy?: number;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}
