import {
  IsNumber,
  IsString,
  IsOptional,
  IsObject,
  IsEnum,
} from 'class-validator';

export enum DeliveryStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  BOUNCED = 'bounced',
}

export class NotificationDeliveryResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  notificationQueueId: number;

  @IsEnum(DeliveryStatus)
  deliveryStatus: string;

  @IsOptional()
  @IsString()
  errorMessage?: string;

  @IsOptional()
  @IsObject()
  providerResponse?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  providerName?: string;

  @IsString()
  deliveryTimestamp: string;

  @IsString()
  createdAt: string;
}
