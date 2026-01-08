import {
  IsNumber,
  IsString,
  IsObject,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class MaintenanceLogResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  maintenanceType: string;

  @IsDateString()
  executionDate: string;

  @IsString()
  status: string;

  @IsOptional()
  @IsNumber()
  durationSeconds?: number;

  @IsOptional()
  @IsObject()
  details?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  executedBy?: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}
