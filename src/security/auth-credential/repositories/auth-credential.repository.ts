import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  TwoFactorAuthEntity,
  IAuthCredentialRepository,
} from './auth-credential.repository.interface';

@Injectable()
export class AuthCredentialRepository implements IAuthCredentialRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<TwoFactorAuthEntity[]> {
    const query = `
      SELECT id, actor_id, two_factor_method, secret_key_encrypted, backup_codes_encrypted,
             phone_number_encrypted, is_enabled, last_used_at, created_at, updated_at
      FROM two_factor_auth
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<TwoFactorAuthEntity>(query);
  }

  async findById(id: number): Promise<TwoFactorAuthEntity | null> {
    const query = `
      SELECT id, actor_id, two_factor_method, secret_key_encrypted, backup_codes_encrypted,
             phone_number_encrypted, is_enabled, last_used_at, created_at, updated_at
      FROM two_factor_auth
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<TwoFactorAuthEntity>(query, [id]);
  }

  async findByActorId(actorId: number): Promise<TwoFactorAuthEntity | null> {
    const query = `
      SELECT id, actor_id, two_factor_method, secret_key_encrypted, backup_codes_encrypted,
             phone_number_encrypted, is_enabled, last_used_at, created_at, updated_at
      FROM two_factor_auth
      WHERE actor_id = $1
    `;
    return await this.databaseService.queryOne<TwoFactorAuthEntity>(query, [
      actorId,
    ]);
  }

  async findEnabled(): Promise<TwoFactorAuthEntity[]> {
    const query = `
      SELECT id, actor_id, two_factor_method, secret_key_encrypted, backup_codes_encrypted,
             phone_number_encrypted, is_enabled, last_used_at, created_at, updated_at
      FROM two_factor_auth
      WHERE is_enabled = true
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<TwoFactorAuthEntity>(query);
  }

  async findByMethod(
    twoFactorMethod: string,
  ): Promise<TwoFactorAuthEntity[]> {
    const query = `
      SELECT id, actor_id, two_factor_method, secret_key_encrypted, backup_codes_encrypted,
             phone_number_encrypted, is_enabled, last_used_at, created_at, updated_at
      FROM two_factor_auth
      WHERE two_factor_method = $1
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<TwoFactorAuthEntity>(query, [
      twoFactorMethod,
    ]);
  }
}
