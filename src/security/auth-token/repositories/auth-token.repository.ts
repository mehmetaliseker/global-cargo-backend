import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { TokenInfo, IAuthTokenRepository } from './auth-token.repository.interface';

@Injectable()
export class AuthTokenRepository implements IAuthTokenRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findByTokenHash(tokenHash: string): Promise<TokenInfo | null> {
    const query = `
      SELECT id as session_id, uuid as session_uuid, actor_id, actor_type,
             session_token_hash as token_hash, expires_at, is_active, last_activity
      FROM user_session
      WHERE session_token_hash = $1
    `;
    const result = await this.databaseService.queryOne<{
      session_id: number;
      session_uuid: string;
      actor_id: number;
      actor_type: string;
      token_hash: string;
      expires_at: Date;
      is_active: boolean;
      last_activity: Date;
    }>(query, [tokenHash]);

    if (!result) {
      return null;
    }

    return {
      sessionId: result.session_id,
      sessionUuid: result.session_uuid,
      actorId: result.actor_id,
      actorType: result.actor_type,
      tokenHash: result.token_hash,
      expiresAt: result.expires_at,
      isActive: result.is_active,
      lastActivity: result.last_activity,
    };
  }

  async findActiveTokensByActorId(actorId: number): Promise<TokenInfo[]> {
    const query = `
      SELECT id as session_id, uuid as session_uuid, actor_id, actor_type,
             session_token_hash as token_hash, expires_at, is_active, last_activity
      FROM user_session
      WHERE actor_id = $1 AND is_active = true AND expires_at > CURRENT_TIMESTAMP
      ORDER BY last_activity DESC
    `;
    const results = await this.databaseService.query<{
      session_id: number;
      session_uuid: string;
      actor_id: number;
      actor_type: string;
      token_hash: string;
      expires_at: Date;
      is_active: boolean;
      last_activity: Date;
    }>(query, [actorId]);

    return results.map((result) => ({
      sessionId: result.session_id,
      sessionUuid: result.session_uuid,
      actorId: result.actor_id,
      actorType: result.actor_type,
      tokenHash: result.token_hash,
      expiresAt: result.expires_at,
      isActive: result.is_active,
      lastActivity: result.last_activity,
    }));
  }

  async findExpiredTokens(): Promise<TokenInfo[]> {
    const query = `
      SELECT id as session_id, uuid as session_uuid, actor_id, actor_type,
             session_token_hash as token_hash, expires_at, is_active, last_activity
      FROM user_session
      WHERE expires_at <= CURRENT_TIMESTAMP
      ORDER BY expires_at DESC
    `;
    const results = await this.databaseService.query<{
      session_id: number;
      session_uuid: string;
      actor_id: number;
      actor_type: string;
      token_hash: string;
      expires_at: Date;
      is_active: boolean;
      last_activity: Date;
    }>(query);

    return results.map((result) => ({
      sessionId: result.session_id,
      sessionUuid: result.session_uuid,
      actorId: result.actor_id,
      actorType: result.actor_type,
      tokenHash: result.token_hash,
      expiresAt: result.expires_at,
      isActive: result.is_active,
      lastActivity: result.last_activity,
    }));
  }

  async findRevokedTokens(): Promise<TokenInfo[]> {
    const query = `
      SELECT id as session_id, uuid as session_uuid, actor_id, actor_type,
             session_token_hash as token_hash, expires_at, is_active, last_activity
      FROM user_session
      WHERE is_active = false OR logout_time IS NOT NULL
      ORDER BY logout_time DESC, last_activity DESC
    `;
    const results = await this.databaseService.query<{
      session_id: number;
      session_uuid: string;
      actor_id: number;
      actor_type: string;
      token_hash: string;
      expires_at: Date;
      is_active: boolean;
      last_activity: Date;
    }>(query);

    return results.map((result) => ({
      sessionId: result.session_id,
      sessionUuid: result.session_uuid,
      actorId: result.actor_id,
      actorType: result.actor_type,
      tokenHash: result.token_hash,
      expiresAt: result.expires_at,
      isActive: result.is_active,
      lastActivity: result.last_activity,
    }));
  }
}
