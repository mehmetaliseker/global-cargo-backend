import { IsString, IsBoolean, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class EmployeeRoleResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  employeeId: number;

  @IsNumber()
  roleId: number;

  @IsDateString()
  assignedAt: string;

  @IsOptional()
  @IsNumber()
  assignedBy?: number;

  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

export class EmployeeRoleWithDetailsResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  employeeId: number;

  @IsString()
  employeeNumber: string;

  @IsString()
  employeeFirstName: string;

  @IsString()
  employeeLastName: string;

  @IsNumber()
  roleId: number;

  @IsString()
  roleCode: string;

  @IsString()
  roleName: string;

  @IsDateString()
  assignedAt: string;

  @IsOptional()
  @IsNumber()
  assignedBy?: number;

  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

