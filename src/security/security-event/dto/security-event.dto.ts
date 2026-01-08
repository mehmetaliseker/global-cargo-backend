import {
  IsNumber,
  IsString,
  IsUUID,
  IsOptional,
  IsBoolean,
  IsObject,
  IsEnum,
} from 'class-validator';

export enum SeverityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export class SecurityPolicyResponseDto {
  @IsNumber()
  id: number;

  @IsUUID()
  uuid: string;

  @IsString()
  policyType: string;

  @IsObject()
  policyRules: Record<string, unknown>;

  @IsNumber()
  minPasswordLength: number;

  @IsBoolean()
  passwordComplexityRequired: boolean;

  @IsOptional()
  @IsNumber()
  passwordExpiryDays?: number;

  @IsNumber()
  sessionTimeoutMinutes: number;

  @IsNumber()
  maxFailedLoginAttempts: number;

  @IsNumber()
  lockoutDurationMinutes: number;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

export class ApiRateLimitResponseDto {
  @IsNumber()
  id: number;

  @IsUUID()
  uuid: string;

  @IsString()
  endpointPattern: string;

  @IsNumber()
  rateLimitCount: number;

  @IsNumber()
  timeWindowSeconds: number;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

export class ApiAccessLogResponseDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsNumber()
  actorId?: number;

  @IsOptional()
  @IsNumber()
  apiKeyId?: number;

  @IsString()
  endpoint: string;

  @IsString()
  httpMethod: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsString()
  requestTime: string;

  @IsOptional()
  @IsNumber()
  responseTimeMs?: number;

  @IsOptional()
  @IsNumber()
  statusCode?: number;

  @IsBoolean()
  rateLimitHit: boolean;

  @IsOptional()
  @IsString()
  errorMessage?: string;

  @IsString()
  createdAt: string;
}

export class SecurityIncidentResponseDto {
  @IsNumber()
  id: number;

  @IsUUID()
  uuid: string;

  @IsString()
  incidentType: string;

  @IsEnum(SeverityLevel)
  severityLevel: string;

  @IsOptional()
  @IsNumber()
  actorId?: number;

  @IsString()
  description: string;

  @IsOptional()
  @IsObject()
  incidentDetails?: Record<string, unknown>;

  @IsString()
  detectedAt: string;

  @IsOptional()
  @IsString()
  resolvedAt?: string;

  @IsOptional()
  @IsString()
  resolutionAction?: string;

  @IsOptional()
  @IsNumber()
  resolvedBy?: number;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}
