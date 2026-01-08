export interface PartnerConfigEntity {
  id: number;
  partner_id: number;
  config_data?: Record<string, unknown>;
  api_key_encrypted?: Buffer;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface IPartnerConfigRepository {
  findAll(): Promise<PartnerConfigEntity[]>;
  findById(id: number): Promise<PartnerConfigEntity | null>;
  findByPartnerId(partnerId: number): Promise<PartnerConfigEntity | null>;
  findActive(): Promise<PartnerConfigEntity[]>;
  create(
    partnerId: number,
    configData: Record<string, unknown> | null,
    apiKeyEncrypted: Buffer | null,
    isActive: boolean,
  ): Promise<PartnerConfigEntity>;
  update(
    id: number,
    configData: Record<string, unknown> | null,
    apiKeyEncrypted: Buffer | null,
    isActive: boolean,
  ): Promise<PartnerConfigEntity>;
  softDelete(id: number): Promise<void>;
}

