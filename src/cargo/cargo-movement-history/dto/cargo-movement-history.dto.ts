import { IsString, IsNumber, IsOptional, IsDateString, IsEnum } from 'class-validator';

export enum LocationTypeEnum {
  BRANCH = 'branch',
  DISTRIBUTION_CENTER = 'distribution_center',
}

export class CargoMovementHistoryResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  cargoId: number;

  @IsEnum(LocationTypeEnum)
  locationType: LocationTypeEnum;

  @IsOptional()
  @IsNumber()
  branchId?: number;

  @IsOptional()
  @IsNumber()
  distributionCenterId?: number;

  @IsDateString()
  movementDate: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  createdAt: string;
}

