import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class RolePermissionResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  roleId: number;

  @IsNumber()
  permissionId: number;

  @IsDateString()
  grantedAt: string;

  @IsOptional()
  @IsNumber()
  grantedBy?: number;
}

export class RolePermissionWithDetailsResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  roleId: number;

  @IsString()
  roleCode: string;

  @IsString()
  roleName: string;

  @IsNumber()
  permissionId: number;

  @IsString()
  permissionCode: string;

  @IsString()
  permissionName: string;

  @IsString()
  resource: string;

  @IsString()
  action: string;

  @IsDateString()
  grantedAt: string;

  @IsOptional()
  @IsNumber()
  grantedBy?: number;
}

