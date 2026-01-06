import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CargoEventLogResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  cargoId: number;

  @IsString()
  eventType: string;

  @IsOptional()
  @IsString()
  eventDescription?: string;

  @IsDateString()
  eventTime: string;

  @IsOptional()
  @IsNumber()
  locationId?: number;

  @IsOptional()
  @IsString()
  locationType?: string;

  @IsOptional()
  @IsNumber()
  employeeId?: number;

  @IsString()
  createdAt: string;
}

