import { Injectable, NotFoundException } from '@nestjs/common';
import { UserSessionRepository } from '../repositories/auth-session.repository';
import { LoginHistoryRepository } from '../repositories/auth-session.repository';
import {
  UserSessionResponseDto,
  LoginHistoryResponseDto,
} from '../dto/auth-session.dto';
import {
  UserSessionEntity,
  LoginHistoryEntity,
} from '../repositories/auth-session.repository.interface';

@Injectable()
export class UserSessionService {
  constructor(
    private readonly userSessionRepository: UserSessionRepository,
  ) {}

  private mapToDto(entity: UserSessionEntity): UserSessionResponseDto {
    // TODO: Mask session_token_hash in production (never expose full hash)
    // For now, return as-is for debugging purposes
    return {
      id: entity.id,
      uuid: entity.uuid,
      actorId: entity.actor_id,
      actorType: entity.actor_type,
      sessionTokenHash: entity.session_token_hash,
      ipAddress: entity.ip_address ?? undefined,
      userAgent: entity.user_agent ?? undefined,
      loginTime: entity.login_time.toISOString(),
      lastActivity: entity.last_activity.toISOString(),
      expiresAt: entity.expires_at.toISOString(),
      isActive: entity.is_active,
      logoutTime: entity.logout_time?.toISOString(),
      createdAt: entity.created_at.toISOString(),
    };
  }

  async findAll(): Promise<UserSessionResponseDto[]> {
    const entities = await this.userSessionRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<UserSessionResponseDto> {
    const entity = await this.userSessionRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`User session with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<UserSessionResponseDto> {
    const entity = await this.userSessionRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(`User session with uuid ${uuid} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByActorId(actorId: number): Promise<UserSessionResponseDto[]> {
    const entities = await this.userSessionRepository.findByActorId(actorId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findActive(): Promise<UserSessionResponseDto[]> {
    const entities = await this.userSessionRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByActorIdActive(actorId: number): Promise<UserSessionResponseDto[]> {
    const entities =
      await this.userSessionRepository.findByActorIdActive(actorId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findExpired(): Promise<UserSessionResponseDto[]> {
    const entities = await this.userSessionRepository.findExpired();
    return entities.map((entity) => this.mapToDto(entity));
  }
}

@Injectable()
export class LoginHistoryService {
  constructor(
    private readonly loginHistoryRepository: LoginHistoryRepository,
  ) {}

  private mapToDto(entity: LoginHistoryEntity): LoginHistoryResponseDto {
    return {
      id: entity.id,
      actorId: entity.actor_id,
      loginTime: entity.login_time.toISOString(),
      logoutTime: entity.logout_time?.toISOString(),
      ipAddress: entity.ip_address ?? undefined,
      userAgent: entity.user_agent ?? undefined,
      loginStatus: entity.login_status,
      failureReason: entity.failure_reason ?? undefined,
      locationCountry: entity.location_country ?? undefined,
      locationCity: entity.location_city ?? undefined,
      locationLatitude: entity.location_latitude
        ? parseFloat(entity.location_latitude.toString())
        : undefined,
      locationLongitude: entity.location_longitude
        ? parseFloat(entity.location_longitude.toString())
        : undefined,
      createdAt: entity.created_at.toISOString(),
    };
  }

  async findAll(): Promise<LoginHistoryResponseDto[]> {
    const entities = await this.loginHistoryRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<LoginHistoryResponseDto> {
    const entity = await this.loginHistoryRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Login history with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByActorId(actorId: number): Promise<LoginHistoryResponseDto[]> {
    const entities = await this.loginHistoryRepository.findByActorId(actorId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByLoginStatus(loginStatus: string): Promise<LoginHistoryResponseDto[]> {
    const entities =
      await this.loginHistoryRepository.findByLoginStatus(loginStatus);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByLoginTimeRange(
    startDate: Date,
    endDate: Date,
  ): Promise<LoginHistoryResponseDto[]> {
    const entities =
      await this.loginHistoryRepository.findByLoginTimeRange(startDate, endDate);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findFailed(): Promise<LoginHistoryResponseDto[]> {
    const entities = await this.loginHistoryRepository.findFailed();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findSuccessful(): Promise<LoginHistoryResponseDto[]> {
    const entities = await this.loginHistoryRepository.findSuccessful();
    return entities.map((entity) => this.mapToDto(entity));
  }
}
