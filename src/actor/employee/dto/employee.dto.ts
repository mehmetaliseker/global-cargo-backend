import {
  IsString,
  IsBoolean,
  IsNumber,
  IsUUID,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class EmployeeResponseDto {
  @IsNumber()
  id: number;

  @IsUUID()
  uuid: string;

  @IsNumber()
  actorId: number;

  @IsString()
  employeeNumber: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsDateString()
  hireDate: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsNumber()
  countryId?: number;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

