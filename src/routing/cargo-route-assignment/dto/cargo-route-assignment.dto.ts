import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';

export class CargoRouteAssignmentResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  cargoId: number;

  @IsNumber()
  routeId: number;

  @IsDateString()
  assignedDate: string;

  @IsOptional()
  @IsNumber()
  assignedBy?: number;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  createdAt: string;
}

export class CreateCargoRouteAssignmentDto {
  @IsNumber()
  @Min(1)
  cargoId: number;

  @IsNumber()
  @Min(1)
  routeId: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  assignedBy?: number;
}

