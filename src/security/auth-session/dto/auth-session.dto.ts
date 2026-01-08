import {
  IsNumber,
  IsString,
  IsUUID,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator';

export enum ActorType {
  CUSTOMER = 'customer',
  EMPLOYEE = 'employee',
  PARTNER = 'partner',
}

export enum LoginStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
}

export class UserSessionResponseDto {
  @IsNumber()
  id: number;

  @IsUUID()
  uuid: string;

  @IsNumber()
  actorId: number;

  @IsEnum(ActorType)
  actorType: string;

  @IsString()
  sessionTokenHash: string; // TODO: Never expose full hash in production, mask it

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsString()
  loginTime: string;

  @IsString()
  lastActivity: string;

  @IsString()
  expiresAt: string;

  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsString()
  logoutTime?: string;

  @IsString()
  createdAt: string;
}

export class LoginHistoryResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  actorId: number;

  @IsString()
  loginTime: string;

  @IsOptional()
  @IsString()
  logoutTime?: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsEnum(LoginStatus)
  loginStatus: string;

  @IsOptional()
  @IsString()
  failureReason?: string;

  @IsOptional()
  @IsString()
  locationCountry?: string;

  @IsOptional()
  @IsString()
  locationCity?: string;

  @IsOptional()
  @IsNumber()
  locationLatitude?: number;

  @IsOptional()
  @IsNumber()
  locationLongitude?: number;

  @IsString()
  createdAt: string;
}
