import { IsString, IsBoolean, IsUUID, IsOptional, IsEnum, IsEmail, IsNumber } from 'class-validator';

export enum ActorTypeEnum {
  CUSTOMER = 'customer',
  EMPLOYEE = 'employee',
  PARTNER = 'partner',
}

export class ActorResponseDto {
  @IsNumber()
  id: number;

  @IsUUID()
  uuid: string;

  @IsEnum(ActorTypeEnum)
  actorType: ActorTypeEnum;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

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

