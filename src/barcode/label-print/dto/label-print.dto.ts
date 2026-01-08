import {
  IsNumber,
  IsString,
  IsUUID,
  IsOptional,
  IsObject,
  IsEnum,
} from 'class-validator';

export enum PrintStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PARTIAL = 'partial',
}

export class LabelConfigurationResponseDto {
  @IsNumber()
  id: number;

  @IsUUID()
  uuid: string;

  @IsNumber()
  labelTemplateId: number;

  @IsOptional()
  @IsNumber()
  cargoId?: number;

  @IsObject()
  configurationData: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  printerSettings?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  languageCode?: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

export class LabelPrintHistoryResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  labelConfigurationId: number;

  @IsEnum(PrintStatus)
  printStatus: string;

  @IsOptional()
  @IsString()
  printerInfo?: string;

  @IsString()
  printDate: string;

  @IsNumber()
  printCount: number;

  @IsOptional()
  @IsString()
  errorMessage?: string;

  @IsOptional()
  @IsNumber()
  printDurationMs?: number;

  @IsString()
  createdAt: string;
}
