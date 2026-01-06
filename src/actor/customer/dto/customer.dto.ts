import {
  IsString,
  IsBoolean,
  IsNumber,
  IsUUID,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CustomerResponseDto {
  @IsNumber()
  id: number;

  @IsUUID()
  uuid: string;

  @IsNumber()
  actorId: number;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  identityNumber?: string;

  @IsOptional()
  @IsNumber()
  countryId?: number;

  @IsDateString()
  registrationDate: string;

  @IsBoolean()
  isVerified: boolean;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

