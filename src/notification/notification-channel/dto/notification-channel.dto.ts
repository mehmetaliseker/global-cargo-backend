import {
  IsNumber,
  IsString,
  IsBoolean,
  IsEnum,
} from 'class-validator';

export enum PreferenceLevel {
  NONE = 'none',
  IMPORTANT_ONLY = 'important_only',
  ALL = 'all',
}

export class CustomerNotificationPreferenceResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  customerId: number;

  @IsString()
  notificationType: string;

  @IsEnum(PreferenceLevel)
  preferenceLevel: string;

  @IsBoolean()
  smsEnabled: boolean;

  @IsBoolean()
  emailEnabled: boolean;

  @IsBoolean()
  pushEnabled: boolean;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsString()
  deletedAt?: string;
}
