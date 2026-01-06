import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CargoReturnRequestResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  cargoId: number;

  @IsDateString()
  requestDate: string;

  @IsString()
  reason: string;

  @IsString()
  status: string;

  @IsOptional()
  @IsNumber()
  requestedBy?: number;

  @IsOptional()
  @IsNumber()
  processedBy?: number;

  @IsOptional()
  @IsDateString()
  processedDate?: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

