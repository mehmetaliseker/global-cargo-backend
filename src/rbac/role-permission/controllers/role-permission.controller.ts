import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { RolePermissionService } from '../services/role-permission.service';
import {
  RolePermissionResponseDto,
  RolePermissionWithDetailsResponseDto,
} from '../dto/role-permission.dto';

@Controller('rbac/role-permissions')
export class RolePermissionController {
  constructor(
    private readonly rolePermissionService: RolePermissionService,
  ) {}

  @Get()
  async findAll(): Promise<RolePermissionResponseDto[]> {
    return await this.rolePermissionService.findAll();
  }

  @Get('role/:roleId')
  async findByRoleId(
    @Param('roleId', ParseIntPipe) roleId: number,
  ): Promise<RolePermissionResponseDto[]> {
    return await this.rolePermissionService.findByRoleId(roleId);
  }

  @Get('role/:roleId/details')
  async findByRoleIdWithDetails(
    @Param('roleId', ParseIntPipe) roleId: number,
  ): Promise<RolePermissionWithDetailsResponseDto[]> {
    return await this.rolePermissionService.findByRoleIdWithDetails(roleId);
  }

  @Get('permission/:permissionId')
  async findByPermissionId(
    @Param('permissionId', ParseIntPipe) permissionId: number,
  ): Promise<RolePermissionResponseDto[]> {
    return await this.rolePermissionService.findByPermissionId(permissionId);
  }

  @Get('permission/:permissionId/details')
  async findByPermissionIdWithDetails(
    @Param('permissionId', ParseIntPipe) permissionId: number,
  ): Promise<RolePermissionWithDetailsResponseDto[]> {
    return await this.rolePermissionService.findByPermissionIdWithDetails(
      permissionId,
    );
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RolePermissionResponseDto> {
    return await this.rolePermissionService.findById(id);
  }
}

