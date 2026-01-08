import {
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class BackupLogResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  backupType: string;

  @IsDateString()
  executionDate: string;

  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  filePath?: string;

  @IsOptional()
  @IsNumber()
  fileSizeBytes?: number;

  @IsOptional()
  @IsNumber()
  durationSeconds?: number;

  @IsOptional()
  @IsDateString()
  restoreTestDate?: string;

  @IsOptional()
  @IsString()
  restoreTestStatus?: string;

  @IsOptional()
  @IsString()
  restoreTestDetails?: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}
