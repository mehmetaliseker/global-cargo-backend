export interface PackagingTypeEntity {
  id: number;
  uuid: string;
  type_code: string;
  type_name: string;
  description?: string;
  special_requirements?: string;
  cost_additional: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface IPackagingTypeRepository {
  findAll(): Promise<PackagingTypeEntity[]>;
  findById(id: number): Promise<PackagingTypeEntity | null>;
  findByUuid(uuid: string): Promise<PackagingTypeEntity | null>;
  findByCode(typeCode: string): Promise<PackagingTypeEntity | null>;
  findActive(): Promise<PackagingTypeEntity[]>;
}
