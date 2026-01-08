export interface SecurityPolicyEntity {
  id: number;
  uuid: string;
  policy_type: string;
  policy_rules: Record<string, unknown>;
  min_password_length: number;
  password_complexity_required: boolean;
  password_expiry_days?: number;
  session_timeout_minutes: number;
  max_failed_login_attempts: number;
  lockout_duration_minutes: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface ApiRateLimitEntity {
  id: number;
  uuid: string;
  endpoint_pattern: string;
  rate_limit_count: number;
  time_window_seconds: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface ApiAccessLogEntity {
  id: number;
  actor_id?: number;
  api_key_id?: number;
  endpoint: string;
  http_method: string;
  ip_address?: string;
  request_time: Date;
  response_time_ms?: number;
  status_code?: number;
  rate_limit_hit: boolean;
  error_message?: string;
  created_at: Date;
}

export interface SecurityIncidentEntity {
  id: number;
  uuid: string;
  incident_type: string;
  severity_level: string;
  actor_id?: number;
  description: string;
  incident_details?: Record<string, unknown>;
  detected_at: Date;
  resolved_at?: Date;
  resolution_action?: string;
  resolved_by?: number;
  created_at: Date;
  updated_at: Date;
}

export interface ISecurityPolicyRepository {
  findAll(): Promise<SecurityPolicyEntity[]>;
  findById(id: number): Promise<SecurityPolicyEntity | null>;
  findByUuid(uuid: string): Promise<SecurityPolicyEntity | null>;
  findByPolicyType(policyType: string): Promise<SecurityPolicyEntity | null>;
  findActive(): Promise<SecurityPolicyEntity[]>;
}

export interface IApiRateLimitRepository {
  findAll(): Promise<ApiRateLimitEntity[]>;
  findById(id: number): Promise<ApiRateLimitEntity | null>;
  findByUuid(uuid: string): Promise<ApiRateLimitEntity | null>;
  findByEndpointPattern(
    endpointPattern: string,
  ): Promise<ApiRateLimitEntity[]>;
  findActive(): Promise<ApiRateLimitEntity[]>;
}

export interface IApiAccessLogRepository {
  findAll(): Promise<ApiAccessLogEntity[]>;
  findById(id: number): Promise<ApiAccessLogEntity | null>;
  findByActorId(actorId: number): Promise<ApiAccessLogEntity[]>;
  findByEndpoint(endpoint: string): Promise<ApiAccessLogEntity[]>;
  findByRequestTimeRange(
    startDate: Date,
    endDate: Date,
  ): Promise<ApiAccessLogEntity[]>;
  findRateLimitHits(): Promise<ApiAccessLogEntity[]>;
  findByStatusCode(statusCode: number): Promise<ApiAccessLogEntity[]>;
}

export interface ISecurityIncidentRepository {
  findAll(): Promise<SecurityIncidentEntity[]>;
  findById(id: number): Promise<SecurityIncidentEntity | null>;
  findByUuid(uuid: string): Promise<SecurityIncidentEntity | null>;
  findBySeverityLevel(severityLevel: string): Promise<SecurityIncidentEntity[]>;
  findByActorId(actorId: number): Promise<SecurityIncidentEntity[]>;
  findUnresolved(): Promise<SecurityIncidentEntity[]>;
  findByIncidentType(incidentType: string): Promise<SecurityIncidentEntity[]>;
}
