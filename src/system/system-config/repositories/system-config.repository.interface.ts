export interface SystemConfigEntity {
  id: number;
  config_key: string;
  config_value?: string;
  config_type?: string;
  description?: string;
  is_encrypted: boolean;
  updated_by?: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface ISystemConfigRepository {
  findAll(): Promise<SystemConfigEntity[]>;
  findById(id: number): Promise<SystemConfigEntity | null>;
  findByKey(configKey: string): Promise<SystemConfigEntity | null>;
  findByType(configType: string): Promise<SystemConfigEntity[]>;
  findActive(): Promise<SystemConfigEntity[]>;
}
