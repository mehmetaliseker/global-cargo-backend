import { Injectable, NotFoundException } from '@nestjs/common';
import { SecurityPolicyRepository } from '../repositories/security-event.repository';
import { ApiRateLimitRepository } from '../repositories/security-event.repository';
import { ApiAccessLogRepository } from '../repositories/security-event.repository';
import { SecurityIncidentRepository } from '../repositories/security-event.repository';
import {
  SecurityPolicyResponseDto,
  ApiRateLimitResponseDto,
  ApiAccessLogResponseDto,
  SecurityIncidentResponseDto,
} from '../dto/security-event.dto';
import {
  SecurityPolicyEntity,
  ApiRateLimitEntity,
  ApiAccessLogEntity,
  SecurityIncidentEntity,
} from '../repositories/security-event.repository.interface';

@Injectable()
export class SecurityPolicyService {
  constructor(
    private readonly securityPolicyRepository: SecurityPolicyRepository,
  ) {}

  private mapToDto(entity: SecurityPolicyEntity): SecurityPolicyResponseDto {
    let policyRules: Record<string, unknown> = {};
    if (entity.policy_rules) {
      if (typeof entity.policy_rules === 'string') {
        policyRules = JSON.parse(entity.policy_rules);
      } else {
        policyRules = entity.policy_rules as Record<string, unknown>;
      }
    }

    return {
      id: entity.id,
      uuid: entity.uuid,
      policyType: entity.policy_type,
      policyRules,
      minPasswordLength: entity.min_password_length,
      passwordComplexityRequired: entity.password_complexity_required,
      passwordExpiryDays: entity.password_expiry_days ?? undefined,
      sessionTimeoutMinutes: entity.session_timeout_minutes,
      maxFailedLoginAttempts: entity.max_failed_login_attempts,
      lockoutDurationMinutes: entity.lockout_duration_minutes,
      isActive: entity.is_active,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<SecurityPolicyResponseDto[]> {
    const entities = await this.securityPolicyRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<SecurityPolicyResponseDto> {
    const entity = await this.securityPolicyRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Security policy with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<SecurityPolicyResponseDto> {
    const entity = await this.securityPolicyRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(
        `Security policy with uuid ${uuid} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByPolicyType(
    policyType: string,
  ): Promise<SecurityPolicyResponseDto> {
    const entity = await this.securityPolicyRepository.findByPolicyType(
      policyType,
    );
    if (!entity) {
      throw new NotFoundException(
        `Security policy with type ${policyType} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findActive(): Promise<SecurityPolicyResponseDto[]> {
    const entities = await this.securityPolicyRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }
}

@Injectable()
export class ApiRateLimitService {
  constructor(
    private readonly apiRateLimitRepository: ApiRateLimitRepository,
  ) {}

  private mapToDto(entity: ApiRateLimitEntity): ApiRateLimitResponseDto {
    return {
      id: entity.id,
      uuid: entity.uuid,
      endpointPattern: entity.endpoint_pattern,
      rateLimitCount: entity.rate_limit_count,
      timeWindowSeconds: entity.time_window_seconds,
      isActive: entity.is_active,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<ApiRateLimitResponseDto[]> {
    const entities = await this.apiRateLimitRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<ApiRateLimitResponseDto> {
    const entity = await this.apiRateLimitRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `API rate limit with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<ApiRateLimitResponseDto> {
    const entity = await this.apiRateLimitRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(
        `API rate limit with uuid ${uuid} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByEndpointPattern(
    endpointPattern: string,
  ): Promise<ApiRateLimitResponseDto[]> {
    const entities =
      await this.apiRateLimitRepository.findByEndpointPattern(endpointPattern);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findActive(): Promise<ApiRateLimitResponseDto[]> {
    const entities = await this.apiRateLimitRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }
}

@Injectable()
export class ApiAccessLogService {
  constructor(
    private readonly apiAccessLogRepository: ApiAccessLogRepository,
  ) {}

  private mapToDto(entity: ApiAccessLogEntity): ApiAccessLogResponseDto {
    return {
      id: entity.id,
      actorId: entity.actor_id ?? undefined,
      apiKeyId: entity.api_key_id ?? undefined,
      endpoint: entity.endpoint,
      httpMethod: entity.http_method,
      ipAddress: entity.ip_address ?? undefined,
      requestTime: entity.request_time.toISOString(),
      responseTimeMs: entity.response_time_ms ?? undefined,
      statusCode: entity.status_code ?? undefined,
      rateLimitHit: entity.rate_limit_hit,
      errorMessage: entity.error_message ?? undefined,
      createdAt: entity.created_at.toISOString(),
    };
  }

  async findAll(): Promise<ApiAccessLogResponseDto[]> {
    const entities = await this.apiAccessLogRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<ApiAccessLogResponseDto> {
    const entity = await this.apiAccessLogRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`API access log with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByActorId(actorId: number): Promise<ApiAccessLogResponseDto[]> {
    const entities = await this.apiAccessLogRepository.findByActorId(actorId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByEndpoint(endpoint: string): Promise<ApiAccessLogResponseDto[]> {
    const entities = await this.apiAccessLogRepository.findByEndpoint(endpoint);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByRequestTimeRange(
    startDate: Date,
    endDate: Date,
  ): Promise<ApiAccessLogResponseDto[]> {
    const entities =
      await this.apiAccessLogRepository.findByRequestTimeRange(
        startDate,
        endDate,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findRateLimitHits(): Promise<ApiAccessLogResponseDto[]> {
    const entities = await this.apiAccessLogRepository.findRateLimitHits();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByStatusCode(
    statusCode: number,
  ): Promise<ApiAccessLogResponseDto[]> {
    const entities =
      await this.apiAccessLogRepository.findByStatusCode(statusCode);
    return entities.map((entity) => this.mapToDto(entity));
  }
}

@Injectable()
export class SecurityIncidentService {
  constructor(
    private readonly securityIncidentRepository: SecurityIncidentRepository,
  ) {}

  private mapToDto(entity: SecurityIncidentEntity): SecurityIncidentResponseDto {
    let incidentDetails: Record<string, unknown> | undefined = undefined;
    if (entity.incident_details) {
      if (typeof entity.incident_details === 'string') {
        incidentDetails = JSON.parse(entity.incident_details);
      } else {
        incidentDetails = entity.incident_details as Record<string, unknown>;
      }
    }

    return {
      id: entity.id,
      uuid: entity.uuid,
      incidentType: entity.incident_type,
      severityLevel: entity.severity_level,
      actorId: entity.actor_id ?? undefined,
      description: entity.description,
      incidentDetails,
      detectedAt: entity.detected_at.toISOString(),
      resolvedAt: entity.resolved_at?.toISOString(),
      resolutionAction: entity.resolution_action ?? undefined,
      resolvedBy: entity.resolved_by ?? undefined,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
    };
  }

  async findAll(): Promise<SecurityIncidentResponseDto[]> {
    const entities = await this.securityIncidentRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<SecurityIncidentResponseDto> {
    const entity = await this.securityIncidentRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Security incident with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<SecurityIncidentResponseDto> {
    const entity = await this.securityIncidentRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(
        `Security incident with uuid ${uuid} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findBySeverityLevel(
    severityLevel: string,
  ): Promise<SecurityIncidentResponseDto[]> {
    const entities =
      await this.securityIncidentRepository.findBySeverityLevel(severityLevel);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByActorId(actorId: number): Promise<SecurityIncidentResponseDto[]> {
    const entities =
      await this.securityIncidentRepository.findByActorId(actorId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findUnresolved(): Promise<SecurityIncidentResponseDto[]> {
    const entities = await this.securityIncidentRepository.findUnresolved();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByIncidentType(
    incidentType: string,
  ): Promise<SecurityIncidentResponseDto[]> {
    const entities =
      await this.securityIncidentRepository.findByIncidentType(incidentType);
    return entities.map((entity) => this.mapToDto(entity));
  }
}
