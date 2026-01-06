export interface PermissionEntity {
  id: number;
  uuid: string;
  code: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface IPermissionRepository {
  findAll(): Promise<PermissionEntity[]>;
  findById(id: number): Promise<PermissionEntity | null>;
  findByUuid(uuid: string): Promise<PermissionEntity | null>;
  findByCode(code: string): Promise<PermissionEntity | null>;
  findByResource(resource: string): Promise<PermissionEntity[]>;
  findActive(): Promise<PermissionEntity[]>;
  findByResourceAndActive(resource: string): Promise<PermissionEntity[]>;
}

