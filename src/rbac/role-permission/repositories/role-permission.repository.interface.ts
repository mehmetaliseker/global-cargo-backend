export interface RolePermissionEntity {
  id: number;
  role_id: number;
  permission_id: number;
  granted_at: Date;
  granted_by?: number;
}

export interface IRolePermissionRepository {
  findAll(): Promise<RolePermissionEntity[]>;
  findById(id: number): Promise<RolePermissionEntity | null>;
  findByRoleId(roleId: number): Promise<RolePermissionEntity[]>;
  findByPermissionId(permissionId: number): Promise<RolePermissionEntity[]>;
  findByRoleIdAndPermissionId(
    roleId: number,
    permissionId: number,
  ): Promise<RolePermissionEntity | null>;
}

