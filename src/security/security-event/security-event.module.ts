import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import {
  SecurityPolicyRepository,
  ApiRateLimitRepository,
  ApiAccessLogRepository,
  SecurityIncidentRepository,
} from './repositories/security-event.repository';
import {
  SecurityPolicyService,
  ApiRateLimitService,
  ApiAccessLogService,
  SecurityIncidentService,
} from './services/security-event.service';
import {
  SecurityPolicyController,
  ApiRateLimitController,
  ApiAccessLogController,
  SecurityIncidentController,
} from './controllers/security-event.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [
    SecurityPolicyController,
    ApiRateLimitController,
    ApiAccessLogController,
    SecurityIncidentController,
  ],
  providers: [
    SecurityPolicyRepository,
    ApiRateLimitRepository,
    ApiAccessLogRepository,
    SecurityIncidentRepository,
    SecurityPolicyService,
    ApiRateLimitService,
    ApiAccessLogService,
    SecurityIncidentService,
  ],
  exports: [
    SecurityPolicyService,
    ApiRateLimitService,
    ApiAccessLogService,
    SecurityIncidentService,
    SecurityPolicyRepository,
    ApiRateLimitRepository,
    ApiAccessLogRepository,
    SecurityIncidentRepository,
  ],
})
export class SecurityEventModule {}
