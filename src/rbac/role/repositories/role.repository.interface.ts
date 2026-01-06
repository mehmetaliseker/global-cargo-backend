export interface RoleEntity {
  id: number;
  uuid: string;
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface IRoleRepository {
  findAll(): Promise<RoleEntity[]>;
  findById(id: number): Promise<RoleEntity | null>;
  findByUuid(uuid: string): Promise<RoleEntity | null>;
  findByCode(code: string): Promise<RoleEntity | null>;
  findActive(): Promise<RoleEntity[]>;
}

