import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { SecurityPolicyService } from '../services/security-event.service';
import { ApiRateLimitService } from '../services/security-event.service';
import { ApiAccessLogService } from '../services/security-event.service';
import { SecurityIncidentService } from '../services/security-event.service';
import {
  SecurityPolicyResponseDto,
  ApiRateLimitResponseDto,
  ApiAccessLogResponseDto,
  SecurityIncidentResponseDto,
} from '../dto/security-event.dto';

@Controller('security/policies')
export class SecurityPolicyController {
  constructor(
    private readonly securityPolicyService: SecurityPolicyService,
  ) {}

  @Get()
  async findAll(): Promise<SecurityPolicyResponseDto[]> {
    return await this.securityPolicyService.findAll();
  }

  @Get('active')
  async findActive(): Promise<SecurityPolicyResponseDto[]> {
    return await this.securityPolicyService.findActive();
  }

  @Get('type/:policyType')
  async findByPolicyType(
    @Param('policyType') policyType: string,
  ): Promise<SecurityPolicyResponseDto> {
    return await this.securityPolicyService.findByPolicyType(policyType);
  }

  @Get('uuid/:uuid')
  async findByUuid(
    @Param('uuid') uuid: string,
  ): Promise<SecurityPolicyResponseDto> {
    return await this.securityPolicyService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SecurityPolicyResponseDto> {
    return await this.securityPolicyService.findById(id);
  }
}

@Controller('security/rate-limits')
export class ApiRateLimitController {
  constructor(
    private readonly apiRateLimitService: ApiRateLimitService,
  ) {}

  @Get()
  async findAll(): Promise<ApiRateLimitResponseDto[]> {
    return await this.apiRateLimitService.findAll();
  }

  @Get('active')
  async findActive(): Promise<ApiRateLimitResponseDto[]> {
    return await this.apiRateLimitService.findActive();
  }

  @Get('endpoint/:endpointPattern')
  async findByEndpointPattern(
    @Param('endpointPattern') endpointPattern: string,
  ): Promise<ApiRateLimitResponseDto[]> {
    return await this.apiRateLimitService.findByEndpointPattern(endpointPattern);
  }

  @Get('uuid/:uuid')
  async findByUuid(
    @Param('uuid') uuid: string,
  ): Promise<ApiRateLimitResponseDto> {
    return await this.apiRateLimitService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiRateLimitResponseDto> {
    return await this.apiRateLimitService.findById(id);
  }
}

@Controller('security/access-logs')
export class ApiAccessLogController {
  constructor(
    private readonly apiAccessLogService: ApiAccessLogService,
  ) {}

  @Get()
  async findAll(): Promise<ApiAccessLogResponseDto[]> {
    return await this.apiAccessLogService.findAll();
  }

  @Get('rate-limit-hits')
  async findRateLimitHits(): Promise<ApiAccessLogResponseDto[]> {
    return await this.apiAccessLogService.findRateLimitHits();
  }

  @Get('actor/:actorId')
  async findByActorId(
    @Param('actorId', ParseIntPipe) actorId: number,
  ): Promise<ApiAccessLogResponseDto[]> {
    return await this.apiAccessLogService.findByActorId(actorId);
  }

  @Get('endpoint/:endpoint')
  async findByEndpoint(
    @Param('endpoint') endpoint: string,
  ): Promise<ApiAccessLogResponseDto[]> {
    return await this.apiAccessLogService.findByEndpoint(endpoint);
  }

  @Get('status-code/:statusCode')
  async findByStatusCode(
    @Param('statusCode', ParseIntPipe) statusCode: number,
  ): Promise<ApiAccessLogResponseDto[]> {
    return await this.apiAccessLogService.findByStatusCode(statusCode);
  }

  @Get('time-range')
  async findByRequestTimeRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<ApiAccessLogResponseDto[]> {
    return await this.apiAccessLogService.findByRequestTimeRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiAccessLogResponseDto> {
    return await this.apiAccessLogService.findById(id);
  }
}

@Controller('security/incidents')
export class SecurityIncidentController {
  constructor(
    private readonly securityIncidentService: SecurityIncidentService,
  ) {}

  @Get()
  async findAll(): Promise<SecurityIncidentResponseDto[]> {
    return await this.securityIncidentService.findAll();
  }

  @Get('unresolved')
  async findUnresolved(): Promise<SecurityIncidentResponseDto[]> {
    return await this.securityIncidentService.findUnresolved();
  }

  @Get('severity/:severityLevel')
  async findBySeverityLevel(
    @Param('severityLevel') severityLevel: string,
  ): Promise<SecurityIncidentResponseDto[]> {
    return await this.securityIncidentService.findBySeverityLevel(severityLevel);
  }

  @Get('type/:incidentType')
  async findByIncidentType(
    @Param('incidentType') incidentType: string,
  ): Promise<SecurityIncidentResponseDto[]> {
    return await this.securityIncidentService.findByIncidentType(incidentType);
  }

  @Get('actor/:actorId')
  async findByActorId(
    @Param('actorId', ParseIntPipe) actorId: number,
  ): Promise<SecurityIncidentResponseDto[]> {
    return await this.securityIncidentService.findByActorId(actorId);
  }

  @Get('uuid/:uuid')
  async findByUuid(
    @Param('uuid') uuid: string,
  ): Promise<SecurityIncidentResponseDto> {
    return await this.securityIncidentService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SecurityIncidentResponseDto> {
    return await this.securityIncidentService.findById(id);
  }
}
