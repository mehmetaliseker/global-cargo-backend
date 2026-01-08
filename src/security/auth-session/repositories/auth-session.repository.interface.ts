export interface UserSessionEntity {
  id: number;
  uuid: string;
  actor_id: number;
  actor_type: string;
  session_token_hash: string;
  ip_address?: string;
  user_agent?: string;
  login_time: Date;
  last_activity: Date;
  expires_at: Date;
  is_active: boolean;
  logout_time?: Date;
  created_at: Date;
}

export interface LoginHistoryEntity {
  id: number;
  actor_id: number;
  login_time: Date;
  logout_time?: Date;
  ip_address?: string;
  user_agent?: string;
  login_status: string;
  failure_reason?: string;
  location_country?: string;
  location_city?: string;
  location_latitude?: number;
  location_longitude?: number;
  created_at: Date;
}

export interface IUserSessionRepository {
  findAll(): Promise<UserSessionEntity[]>;
  findById(id: number): Promise<UserSessionEntity | null>;
  findByUuid(uuid: string): Promise<UserSessionEntity | null>;
  findByActorId(actorId: number): Promise<UserSessionEntity[]>;
  findActive(): Promise<UserSessionEntity[]>;
  findByActorIdActive(actorId: number): Promise<UserSessionEntity[]>;
  findByTokenHash(tokenHash: string): Promise<UserSessionEntity | null>;
  findExpired(): Promise<UserSessionEntity[]>;
}

export interface ILoginHistoryRepository {
  findAll(): Promise<LoginHistoryEntity[]>;
  findById(id: number): Promise<LoginHistoryEntity | null>;
  findByActorId(actorId: number): Promise<LoginHistoryEntity[]>;
  findByLoginStatus(loginStatus: string): Promise<LoginHistoryEntity[]>;
  findByLoginTimeRange(
    startDate: Date,
    endDate: Date,
  ): Promise<LoginHistoryEntity[]>;
  findFailed(): Promise<LoginHistoryEntity[]>;
  findSuccessful(): Promise<LoginHistoryEntity[]>;
}
