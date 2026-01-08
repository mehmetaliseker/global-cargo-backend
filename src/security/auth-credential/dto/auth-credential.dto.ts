import {
  IsNumber,
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator';

export enum TwoFactorMethod {
  SMS = 'sms',
  EMAIL = 'email',
  AUTHENTICATOR = 'authenticator',
}

export class TwoFactorAuthResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  actorId: number;

  @IsEnum(TwoFactorMethod)
  twoFactorMethod: string;

  // TODO: Never expose encrypted fields in production
  // These are masked/omitted for security
  @IsOptional()
  secretKeyEncrypted?: string; // Placeholder - should be masked

  @IsOptional()
  backupCodesEncrypted?: string; // Placeholder - should be masked

  @IsOptional()
  phoneNumberEncrypted?: string; // Placeholder - should be masked

  @IsBoolean()
  isEnabled: boolean;

  @IsOptional()
  @IsString()
  lastUsedAt?: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}
