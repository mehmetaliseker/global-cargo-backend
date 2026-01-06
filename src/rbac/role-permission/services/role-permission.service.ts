import { Injectable, NotFoundException } from '@nestjs/common';
import { RolePermissionRepository } from '../repositories/role-permission.repository';
import {
  RolePermissionResponseDto,
  RolePermissionWithDetailsResponseDto,
} from '../dto/role-permission.dto';
import { RolePermissionEntity } from '../repositories/role-permission.repository.interface';
import { RoleRepository } from '../../role/repositories/role.repository';
import { PermissionRepository } from '../../permission/repositories/permission.repository';

@Injectable()
export class RolePermissionService {
  constructor(
    private readonly rolePermissionRepository: RolePermissionRepository,
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
  ) {}

  private mapToDto(
    entity: RolePermissionEntity,
  ): RolePermissionResponseDto {
    return {
      id: entity.id,
      roleId: entity.role_id,
      permissionId: entity.permission_id,
      grantedAt: entity.granted_at.toISOString(),
      grantedBy: entity.granted_by,
    };
  }

  async findAll(): Promise<RolePermissionResponseDto[]> {
    const entities = await this.rolePermissionRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<RolePermissionResponseDto> {
    const entity = await this.rolePermissionRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Role permission with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByRoleId(roleId: number): Promise<RolePermissionResponseDto[]> {
    const entities = await this.rolePermissionRepository.findByRoleId(roleId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByPermissionId(
    permissionId: number,
  ): Promise<RolePermissionResponseDto[]> {
    const entities =
      await this.rolePermissionRepository.findByPermissionId(permissionId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByRoleIdWithDetails(
    roleId: number,
  ): Promise<RolePermissionWithDetailsResponseDto[]> {
    const rolePermissions =
      await this.rolePermissionRepository.findByRoleId(roleId);
    const role = await this.roleRepository.findById(roleId);
    if (!role) {
      throw new NotFoundException(`Role with id ${roleId} not found`);
    }

    const result: RolePermissionWithDetailsResponseDto[] = [];

    for (const rp of rolePermissions) {
      const permission = await this.permissionRepository.findById(
        rp.permission_id,
      );
      if (permission) {
        result.push({
          id: rp.id,
          roleId: rp.role_id,
          roleCode: role.code,
          roleName: role.name,
          permissionId: rp.permission_id,
          permissionCode: permission.code,
          permissionName: permission.name,
          resource: permission.resource,
          action: permission.action,
          grantedAt: rp.granted_at.toISOString(),
          grantedBy: rp.granted_by,
        });
      }
    }

    return result;
  }

  async findByPermissionIdWithDetails(
    permissionId: number,
  ): Promise<RolePermissionWithDetailsResponseDto[]> {
    const rolePermissions =
      await this.rolePermissionRepository.findByPermissionId(permissionId);
    const permission = await this.permissionRepository.findById(permissionId);
    if (!permission) {
      throw new NotFoundException(
        `Permission with id ${permissionId} not found`,
      );
    }

    const result: RolePermissionWithDetailsResponseDto[] = [];

    for (const rp of rolePermissions) {
      const role = await this.roleRepository.findById(rp.role_id);
      if (role) {
        result.push({
          id: rp.id,
          roleId: rp.role_id,
          roleCode: role.code,
          roleName: role.name,
          permissionId: rp.permission_id,
          permissionCode: permission.code,
          permissionName: permission.name,
          resource: permission.resource,
          action: permission.action,
          grantedAt: rp.granted_at.toISOString(),
          grantedBy: rp.granted_by,
        });
      }
    }

    return result;
  }
}

