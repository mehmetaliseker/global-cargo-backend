import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CargoStateHistoryResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  cargoId: number;

  @IsNumber()
  stateId: number;

  @IsDateString()
  eventTime: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  changedBy?: number;

  @IsString()
  createdAt: string;
}

