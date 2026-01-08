import {
  IsNumber,
  IsString,
  IsUUID,
  IsOptional,
  IsBoolean,
  IsEnum,
  MaxLength,
  MinLength,
  IsObject,
} from 'class-validator';

export enum NotificationType {
  SMS = 'sms',
  EMAIL = 'email',
  PUSH = 'push',
}

export class NotificationTemplateResponseDto {
  @IsNumber()
  id: number;

  @IsUUID()
  uuid: string;

  @IsString()
  templateCode: string;

  @IsString()
  templateName: string;

  @IsEnum(NotificationType)
  notificationType: string;

  @IsOptional()
  @IsString()
  subjectTemplate?: string;

  @IsString()
  bodyTemplate: string;

  @IsOptional()
  @IsString()
  languageCode?: string;

  @IsOptional()
  @IsObject()
  variables?: Record<string, unknown>;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}
