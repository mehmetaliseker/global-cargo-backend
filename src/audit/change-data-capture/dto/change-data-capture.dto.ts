import {
  IsNumber,
  IsString,
  IsObject,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class ChangeDataCaptureResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  sourceTable: string;

  @IsNumber()
  sourceRecordId: number;

  @IsOptional()
  @IsString()
  sourceRecordUuid?: string;

  @IsString()
  changeType: string;

  @IsObject()
  changeData: Record<string, unknown>;

  @IsDateString()
  changeTimestamp: string;

  @IsBoolean()
  processed: boolean;

  @IsOptional()
  @IsDateString()
  processedAt?: string;

  @IsDateString()
  createdAt: string;
}

export class ChangeDataCaptureQueryDto {
  @IsOptional()
  @IsString()
  sourceTable?: string;

  @IsOptional()
  @IsNumber()
  sourceRecordId?: number;

  @IsOptional()
  @IsString()
  sourceRecordUuid?: string;

  @IsOptional()
  @IsString()
  changeType?: string;

  @IsOptional()
  @IsBoolean()
  processed?: boolean;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
