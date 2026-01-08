export interface TwoFactorAuthEntity {
  id: number;
  actor_id: number;
  two_factor_method: string;
  secret_key_encrypted?: Buffer;
  backup_codes_encrypted?: Buffer;
  phone_number_encrypted?: Buffer;
  is_enabled: boolean;
  last_used_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface IAuthCredentialRepository {
  findAll(): Promise<TwoFactorAuthEntity[]>;
  findById(id: number): Promise<TwoFactorAuthEntity | null>;
  findByActorId(actorId: number): Promise<TwoFactorAuthEntity | null>;
  findEnabled(): Promise<TwoFactorAuthEntity[]>;
  findByMethod(twoFactorMethod: string): Promise<TwoFactorAuthEntity[]>;
}
