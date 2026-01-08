import {
  IsNumber,
  IsString,
  IsObject,
  IsOptional,
  IsUUID,
  IsDateString,
} from 'class-validator';

export class ArchiveResponseDto {
  @IsNumber()
  id: number;

  @IsUUID()
  uuid: string;

  @IsString()
  sourceTableName: string;

  @IsNumber()
  sourceRecordId: number;

  @IsOptional()
  @IsString()
  sourceRecordUuid?: string;

  @IsString()
  archiveType: string;

  @IsObject()
  archiveData: Record<string, unknown>;

  @IsDateString()
  archiveDate: string;

  @IsOptional()
  @IsNumber()
  archivedBy?: number;

  @IsOptional()
  @IsString()
  archiveReason?: string;

  @IsDateString()
  createdAt: string;
}

export class ArchiveQueryDto {
  @IsOptional()
  @IsString()
  sourceTableName?: string;

  @IsOptional()
  @IsNumber()
  sourceRecordId?: number;

  @IsOptional()
  @IsString()
  sourceRecordUuid?: string;

  @IsOptional()
  @IsString()
  archiveType?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  archivedBy?: number;
}
