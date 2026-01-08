import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  SecurityPolicyEntity,
  ISecurityPolicyRepository,
  ApiRateLimitEntity,
  IApiRateLimitRepository,
  ApiAccessLogEntity,
  IApiAccessLogRepository,
  SecurityIncidentEntity,
  ISecurityIncidentRepository,
} from './security-event.repository.interface';

@Injectable()
export class SecurityPolicyRepository implements ISecurityPolicyRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<SecurityPolicyEntity[]> {
    const query = `
      SELECT id, uuid, policy_type, policy_rules, min_password_length,
             password_complexity_required, password_expiry_days, session_timeout_minutes,
             max_failed_login_attempts, lockout_duration_minutes, is_active,
             created_at, updated_at, deleted_at
      FROM security_policy
      WHERE deleted_at IS NULL
      ORDER BY policy_type ASC
    `;
    return await this.databaseService.query<SecurityPolicyEntity>(query);
  }

  async findById(id: number): Promise<SecurityPolicyEntity | null> {
    const query = `
      SELECT id, uuid, policy_type, policy_rules, min_password_length,
             password_complexity_required, password_expiry_days, session_timeout_minutes,
             max_failed_login_attempts, lockout_duration_minutes, is_active,
             created_at, updated_at, deleted_at
      FROM security_policy
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<SecurityPolicyEntity>(query, [
      id,
    ]);
  }

  async findByUuid(uuid: string): Promise<SecurityPolicyEntity | null> {
    const query = `
      SELECT id, uuid, policy_type, policy_rules, min_password_length,
             password_complexity_required, password_expiry_days, session_timeout_minutes,
             max_failed_login_attempts, lockout_duration_minutes, is_active,
             created_at, updated_at, deleted_at
      FROM security_policy
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<SecurityPolicyEntity>(query, [
      uuid,
    ]);
  }

  async findByPolicyType(
    policyType: string,
  ): Promise<SecurityPolicyEntity | null> {
    const query = `
      SELECT id, uuid, policy_type, policy_rules, min_password_length,
             password_complexity_required, password_expiry_days, session_timeout_minutes,
             max_failed_login_attempts, lockout_duration_minutes, is_active,
             created_at, updated_at, deleted_at
      FROM security_policy
      WHERE policy_type = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<SecurityPolicyEntity>(query, [
      policyType,
    ]);
  }

  async findActive(): Promise<SecurityPolicyEntity[]> {
    const query = `
      SELECT id, uuid, policy_type, policy_rules, min_password_length,
             password_complexity_required, password_expiry_days, session_timeout_minutes,
             max_failed_login_attempts, lockout_duration_minutes, is_active,
             created_at, updated_at, deleted_at
      FROM security_policy
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY policy_type ASC
    `;
    return await this.databaseService.query<SecurityPolicyEntity>(query);
  }
}

@Injectable()
export class ApiRateLimitRepository implements IApiRateLimitRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<ApiRateLimitEntity[]> {
    const query = `
      SELECT id, uuid, endpoint_pattern, rate_limit_count, time_window_seconds,
             is_active, created_at, updated_at, deleted_at
      FROM api_rate_limit
      WHERE deleted_at IS NULL
      ORDER BY endpoint_pattern ASC
    `;
    return await this.databaseService.query<ApiRateLimitEntity>(query);
  }

  async findById(id: number): Promise<ApiRateLimitEntity | null> {
    const query = `
      SELECT id, uuid, endpoint_pattern, rate_limit_count, time_window_seconds,
             is_active, created_at, updated_at, deleted_at
      FROM api_rate_limit
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<ApiRateLimitEntity>(query, [
      id,
    ]);
  }

  async findByUuid(uuid: string): Promise<ApiRateLimitEntity | null> {
    const query = `
      SELECT id, uuid, endpoint_pattern, rate_limit_count, time_window_seconds,
             is_active, created_at, updated_at, deleted_at
      FROM api_rate_limit
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<ApiRateLimitEntity>(query, [
      uuid,
    ]);
  }

  async findByEndpointPattern(
    endpointPattern: string,
  ): Promise<ApiRateLimitEntity[]> {
    const query = `
      SELECT id, uuid, endpoint_pattern, rate_limit_count, time_window_seconds,
             is_active, created_at, updated_at, deleted_at
      FROM api_rate_limit
      WHERE endpoint_pattern LIKE $1 AND deleted_at IS NULL
      ORDER BY endpoint_pattern ASC
    `;
    return await this.databaseService.query<ApiRateLimitEntity>(query, [
      `%${endpointPattern}%`,
    ]);
  }

  async findActive(): Promise<ApiRateLimitEntity[]> {
    const query = `
      SELECT id, uuid, endpoint_pattern, rate_limit_count, time_window_seconds,
             is_active, created_at, updated_at, deleted_at
      FROM api_rate_limit
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY endpoint_pattern ASC
    `;
    return await this.databaseService.query<ApiRateLimitEntity>(query);
  }
}

@Injectable()
export class ApiAccessLogRepository implements IApiAccessLogRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<ApiAccessLogEntity[]> {
    const query = `
      SELECT id, actor_id, api_key_id, endpoint, http_method, ip_address,
             request_time, response_time_ms, status_code, rate_limit_hit,
             error_message, created_at
      FROM api_access_log
      ORDER BY request_time DESC
    `;
    return await this.databaseService.query<ApiAccessLogEntity>(query);
  }

  async findById(id: number): Promise<ApiAccessLogEntity | null> {
    const query = `
      SELECT id, actor_id, api_key_id, endpoint, http_method, ip_address,
             request_time, response_time_ms, status_code, rate_limit_hit,
             error_message, created_at
      FROM api_access_log
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<ApiAccessLogEntity>(query, [id]);
  }

  async findByActorId(actorId: number): Promise<ApiAccessLogEntity[]> {
    const query = `
      SELECT id, actor_id, api_key_id, endpoint, http_method, ip_address,
             request_time, response_time_ms, status_code, rate_limit_hit,
             error_message, created_at
      FROM api_access_log
      WHERE actor_id = $1
      ORDER BY request_time DESC
    `;
    return await this.databaseService.query<ApiAccessLogEntity>(query, [
      actorId,
    ]);
  }

  async findByEndpoint(endpoint: string): Promise<ApiAccessLogEntity[]> {
    const query = `
      SELECT id, actor_id, api_key_id, endpoint, http_method, ip_address,
             request_time, response_time_ms, status_code, rate_limit_hit,
             error_message, created_at
      FROM api_access_log
      WHERE endpoint = $1
      ORDER BY request_time DESC
    `;
    return await this.databaseService.query<ApiAccessLogEntity>(query, [
      endpoint,
    ]);
  }

  async findByRequestTimeRange(
    startDate: Date,
    endDate: Date,
  ): Promise<ApiAccessLogEntity[]> {
    const query = `
      SELECT id, actor_id, api_key_id, endpoint, http_method, ip_address,
             request_time, response_time_ms, status_code, rate_limit_hit,
             error_message, created_at
      FROM api_access_log
      WHERE request_time >= $1 AND request_time <= $2
      ORDER BY request_time DESC
    `;
    return await this.databaseService.query<ApiAccessLogEntity>(query, [
      startDate,
      endDate,
    ]);
  }

  async findRateLimitHits(): Promise<ApiAccessLogEntity[]> {
    const query = `
      SELECT id, actor_id, api_key_id, endpoint, http_method, ip_address,
             request_time, response_time_ms, status_code, rate_limit_hit,
             error_message, created_at
      FROM api_access_log
      WHERE rate_limit_hit = true
      ORDER BY request_time DESC
    `;
    return await this.databaseService.query<ApiAccessLogEntity>(query);
  }

  async findByStatusCode(statusCode: number): Promise<ApiAccessLogEntity[]> {
    const query = `
      SELECT id, actor_id, api_key_id, endpoint, http_method, ip_address,
             request_time, response_time_ms, status_code, rate_limit_hit,
             error_message, created_at
      FROM api_access_log
      WHERE status_code = $1
      ORDER BY request_time DESC
    `;
    return await this.databaseService.query<ApiAccessLogEntity>(query, [
      statusCode,
    ]);
  }
}

@Injectable()
export class SecurityIncidentRepository
  implements ISecurityIncidentRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<SecurityIncidentEntity[]> {
    const query = `
      SELECT id, uuid, incident_type, severity_level, actor_id, description,
             incident_details, detected_at, resolved_at, resolution_action,
             resolved_by, created_at, updated_at
      FROM security_incident
      ORDER BY detected_at DESC
    `;
    return await this.databaseService.query<SecurityIncidentEntity>(query);
  }

  async findById(id: number): Promise<SecurityIncidentEntity | null> {
    const query = `
      SELECT id, uuid, incident_type, severity_level, actor_id, description,
             incident_details, detected_at, resolved_at, resolution_action,
             resolved_by, created_at, updated_at
      FROM security_incident
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<SecurityIncidentEntity>(query, [
      id,
    ]);
  }

  async findByUuid(uuid: string): Promise<SecurityIncidentEntity | null> {
    const query = `
      SELECT id, uuid, incident_type, severity_level, actor_id, description,
             incident_details, detected_at, resolved_at, resolution_action,
             resolved_by, created_at, updated_at
      FROM security_incident
      WHERE uuid = $1
    `;
    return await this.databaseService.queryOne<SecurityIncidentEntity>(query, [
      uuid,
    ]);
  }

  async findBySeverityLevel(
    severityLevel: string,
  ): Promise<SecurityIncidentEntity[]> {
    const query = `
      SELECT id, uuid, incident_type, severity_level, actor_id, description,
             incident_details, detected_at, resolved_at, resolution_action,
             resolved_by, created_at, updated_at
      FROM security_incident
      WHERE severity_level = $1
      ORDER BY detected_at DESC
    `;
    return await this.databaseService.query<SecurityIncidentEntity>(query, [
      severityLevel,
    ]);
  }

  async findByActorId(actorId: number): Promise<SecurityIncidentEntity[]> {
    const query = `
      SELECT id, uuid, incident_type, severity_level, actor_id, description,
             incident_details, detected_at, resolved_at, resolution_action,
             resolved_by, created_at, updated_at
      FROM security_incident
      WHERE actor_id = $1
      ORDER BY detected_at DESC
    `;
    return await this.databaseService.query<SecurityIncidentEntity>(query, [
      actorId,
    ]);
  }

  async findUnresolved(): Promise<SecurityIncidentEntity[]> {
    const query = `
      SELECT id, uuid, incident_type, severity_level, actor_id, description,
             incident_details, detected_at, resolved_at, resolution_action,
             resolved_by, created_at, updated_at
      FROM security_incident
      WHERE resolved_at IS NULL
      ORDER BY severity_level DESC, detected_at DESC
    `;
    return await this.databaseService.query<SecurityIncidentEntity>(query);
  }

  async findByIncidentType(
    incidentType: string,
  ): Promise<SecurityIncidentEntity[]> {
    const query = `
      SELECT id, uuid, incident_type, severity_level, actor_id, description,
             incident_details, detected_at, resolved_at, resolution_action,
             resolved_by, created_at, updated_at
      FROM security_incident
      WHERE incident_type = $1
      ORDER BY detected_at DESC
    `;
    return await this.databaseService.query<SecurityIncidentEntity>(query, [
      incidentType,
    ]);
  }
}
