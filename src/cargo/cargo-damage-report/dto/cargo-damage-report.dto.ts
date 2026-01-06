import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CargoDamageReportResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  cargoId: number;

  @IsString()
  damageDescription: string;

  @IsOptional()
  @IsString()
  severity?: string;

  @IsDateString()
  reportedDate: string;

  @IsOptional()
  @IsNumber()
  reportedBy?: number;

  @IsOptional()
  @IsNumber()
  investigatedBy?: number;

  @IsOptional()
  @IsDateString()
  investigationDate?: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

