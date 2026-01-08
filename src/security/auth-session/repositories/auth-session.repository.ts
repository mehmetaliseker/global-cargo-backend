import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  UserSessionEntity,
  IUserSessionRepository,
  LoginHistoryEntity,
  ILoginHistoryRepository,
} from './auth-session.repository.interface';

@Injectable()
export class UserSessionRepository implements IUserSessionRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<UserSessionEntity[]> {
    const query = `
      SELECT id, uuid, actor_id, actor_type, session_token_hash, ip_address, user_agent,
             login_time, last_activity, expires_at, is_active, logout_time, created_at
      FROM user_session
      ORDER BY login_time DESC
    `;
    return await this.databaseService.query<UserSessionEntity>(query);
  }

  async findById(id: number): Promise<UserSessionEntity | null> {
    const query = `
      SELECT id, uuid, actor_id, actor_type, session_token_hash, ip_address, user_agent,
             login_time, last_activity, expires_at, is_active, logout_time, created_at
      FROM user_session
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<UserSessionEntity>(query, [id]);
  }

  async findByUuid(uuid: string): Promise<UserSessionEntity | null> {
    const query = `
      SELECT id, uuid, actor_id, actor_type, session_token_hash, ip_address, user_agent,
             login_time, last_activity, expires_at, is_active, logout_time, created_at
      FROM user_session
      WHERE uuid = $1
    `;
    return await this.databaseService.queryOne<UserSessionEntity>(query, [uuid]);
  }

  async findByActorId(actorId: number): Promise<UserSessionEntity[]> {
    const query = `
      SELECT id, uuid, actor_id, actor_type, session_token_hash, ip_address, user_agent,
             login_time, last_activity, expires_at, is_active, logout_time, created_at
      FROM user_session
      WHERE actor_id = $1
      ORDER BY login_time DESC
    `;
    return await this.databaseService.query<UserSessionEntity>(query, [actorId]);
  }

  async findActive(): Promise<UserSessionEntity[]> {
    const query = `
      SELECT id, uuid, actor_id, actor_type, session_token_hash, ip_address, user_agent,
             login_time, last_activity, expires_at, is_active, logout_time, created_at
      FROM user_session
      WHERE is_active = true AND expires_at > CURRENT_TIMESTAMP
      ORDER BY last_activity DESC
    `;
    return await this.databaseService.query<UserSessionEntity>(query);
  }

  async findByActorIdActive(actorId: number): Promise<UserSessionEntity[]> {
    const query = `
      SELECT id, uuid, actor_id, actor_type, session_token_hash, ip_address, user_agent,
             login_time, last_activity, expires_at, is_active, logout_time, created_at
      FROM user_session
      WHERE actor_id = $1 AND is_active = true AND expires_at > CURRENT_TIMESTAMP
      ORDER BY last_activity DESC
    `;
    return await this.databaseService.query<UserSessionEntity>(query, [actorId]);
  }

  async findByTokenHash(tokenHash: string): Promise<UserSessionEntity | null> {
    const query = `
      SELECT id, uuid, actor_id, actor_type, session_token_hash, ip_address, user_agent,
             login_time, last_activity, expires_at, is_active, logout_time, created_at
      FROM user_session
      WHERE session_token_hash = $1 AND is_active = true
    `;
    return await this.databaseService.queryOne<UserSessionEntity>(query, [
      tokenHash,
    ]);
  }

  async findExpired(): Promise<UserSessionEntity[]> {
    const query = `
      SELECT id, uuid, actor_id, actor_type, session_token_hash, ip_address, user_agent,
             login_time, last_activity, expires_at, is_active, logout_time, created_at
      FROM user_session
      WHERE expires_at <= CURRENT_TIMESTAMP OR is_active = false
      ORDER BY expires_at DESC
    `;
    return await this.databaseService.query<UserSessionEntity>(query);
  }
}

@Injectable()
export class LoginHistoryRepository implements ILoginHistoryRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<LoginHistoryEntity[]> {
    const query = `
      SELECT id, actor_id, login_time, logout_time, ip_address, user_agent, login_status,
             failure_reason, location_country, location_city, location_latitude,
             location_longitude, created_at
      FROM login_history
      ORDER BY login_time DESC
    `;
    return await this.databaseService.query<LoginHistoryEntity>(query);
  }

  async findById(id: number): Promise<LoginHistoryEntity | null> {
    const query = `
      SELECT id, actor_id, login_time, logout_time, ip_address, user_agent, login_status,
             failure_reason, location_country, location_city, location_latitude,
             location_longitude, created_at
      FROM login_history
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<LoginHistoryEntity>(query, [id]);
  }

  async findByActorId(actorId: number): Promise<LoginHistoryEntity[]> {
    const query = `
      SELECT id, actor_id, login_time, logout_time, ip_address, user_agent, login_status,
             failure_reason, location_country, location_city, location_latitude,
             location_longitude, created_at
      FROM login_history
      WHERE actor_id = $1
      ORDER BY login_time DESC
    `;
    return await this.databaseService.query<LoginHistoryEntity>(query, [
      actorId,
    ]);
  }

  async findByLoginStatus(loginStatus: string): Promise<LoginHistoryEntity[]> {
    const query = `
      SELECT id, actor_id, login_time, logout_time, ip_address, user_agent, login_status,
             failure_reason, location_country, location_city, location_latitude,
             location_longitude, created_at
      FROM login_history
      WHERE login_status = $1
      ORDER BY login_time DESC
    `;
    return await this.databaseService.query<LoginHistoryEntity>(query, [
      loginStatus,
    ]);
  }

  async findByLoginTimeRange(
    startDate: Date,
    endDate: Date,
  ): Promise<LoginHistoryEntity[]> {
    const query = `
      SELECT id, actor_id, login_time, logout_time, ip_address, user_agent, login_status,
             failure_reason, location_country, location_city, location_latitude,
             location_longitude, created_at
      FROM login_history
      WHERE login_time >= $1 AND login_time <= $2
      ORDER BY login_time DESC
    `;
    return await this.databaseService.query<LoginHistoryEntity>(query, [
      startDate,
      endDate,
    ]);
  }

  async findFailed(): Promise<LoginHistoryEntity[]> {
    const query = `
      SELECT id, actor_id, login_time, logout_time, ip_address, user_agent, login_status,
             failure_reason, location_country, location_city, location_latitude,
             location_longitude, created_at
      FROM login_history
      WHERE login_status = 'failed'
      ORDER BY login_time DESC
    `;
    return await this.databaseService.query<LoginHistoryEntity>(query);
  }

  async findSuccessful(): Promise<LoginHistoryEntity[]> {
    const query = `
      SELECT id, actor_id, login_time, logout_time, ip_address, user_agent, login_status,
             failure_reason, location_country, location_city, location_latitude,
             location_longitude, created_at
      FROM login_history
      WHERE login_status = 'success'
      ORDER BY login_time DESC
    `;
    return await this.databaseService.query<LoginHistoryEntity>(query);
  }
}
