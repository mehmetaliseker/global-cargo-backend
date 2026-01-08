import {
  IsNumber,
  IsString,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class SystemConfigResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  configKey: string;

  @IsOptional()
  @IsString()
  configValue?: string;

  @IsOptional()
  @IsString()
  configType?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsBoolean()
  isEncrypted: boolean;

  @IsOptional()
  @IsNumber()
  updatedBy?: number;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}
