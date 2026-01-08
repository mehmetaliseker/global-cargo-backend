import {
  IsNumber,
  IsString,
  IsUUID,
  IsBoolean,
  IsEnum,
} from 'class-validator';

export enum ActorType {
  CUSTOMER = 'customer',
  EMPLOYEE = 'employee',
  PARTNER = 'partner',
}

export class TokenInfoResponseDto {
  @IsNumber()
  sessionId: number;

  @IsUUID()
  sessionUuid: string;

  @IsNumber()
  actorId: number;

  @IsEnum(ActorType)
  actorType: string;

  @IsString()
  tokenHash: string; // TODO: Mask token hash in production (never expose full hash)

  @IsString()
  expiresAt: string;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  lastActivity: string;
}
