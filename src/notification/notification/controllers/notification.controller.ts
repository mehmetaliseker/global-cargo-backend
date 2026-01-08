import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { NotificationQueueService } from '../services/notification.service';
import { AlertRuleService } from '../services/notification.service';
import { AlertLogService } from '../services/notification.service';
import {
  NotificationQueueResponseDto,
  AlertRuleResponseDto,
  AlertLogResponseDto,
} from '../dto/notification.dto';

@Controller('notification/queue')
export class NotificationQueueController {
  constructor(
    private readonly notificationService: NotificationQueueService,
  ) {}

  @Get()
  async findAll(): Promise<NotificationQueueResponseDto[]> {
    return await this.notificationService.findAll();
  }

  @Get('status/:status')
  async findByStatus(
    @Param('status') status: string,
  ): Promise<NotificationQueueResponseDto[]> {
    return await this.notificationService.findByStatus(status);
  }

  @Get('pending')
  async findPending(): Promise<NotificationQueueResponseDto[]> {
    return await this.notificationService.findPending();
  }

  @Get('failed')
  async findFailed(): Promise<NotificationQueueResponseDto[]> {
    return await this.notificationService.findFailed();
  }

  @Get('recipient/:recipientType/:recipientId')
  async findByRecipient(
    @Param('recipientType') recipientType: string,
    @Param('recipientId', ParseIntPipe) recipientId: number,
  ): Promise<NotificationQueueResponseDto[]> {
    return await this.notificationService.findByRecipient(
      recipientType,
      recipientId,
    );
  }

  @Get('scheduled-range')
  async findByScheduledTimeRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<NotificationQueueResponseDto[]> {
    return await this.notificationService.findByScheduledTimeRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('uuid/:uuid')
  async findByUuid(
    @Param('uuid') uuid: string,
  ): Promise<NotificationQueueResponseDto> {
    return await this.notificationService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<NotificationQueueResponseDto> {
    return await this.notificationService.findById(id);
  }
}

@Controller('notification/alerts/rules')
export class AlertRuleController {
  constructor(private readonly alertRuleService: AlertRuleService) {}

  @Get()
  async findAll(): Promise<AlertRuleResponseDto[]> {
    return await this.alertRuleService.findAll();
  }

  @Get('active')
  async findActive(): Promise<AlertRuleResponseDto[]> {
    return await this.alertRuleService.findActive();
  }

  @Get('severity/:severityLevel')
  async findBySeverityLevel(
    @Param('severityLevel') severityLevel: string,
  ): Promise<AlertRuleResponseDto[]> {
    return await this.alertRuleService.findBySeverityLevel(severityLevel);
  }

  @Get('uuid/:uuid')
  async findByUuid(
    @Param('uuid') uuid: string,
  ): Promise<AlertRuleResponseDto> {
    return await this.alertRuleService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AlertRuleResponseDto> {
    return await this.alertRuleService.findById(id);
  }
}

@Controller('notification/alerts/logs')
export class AlertLogController {
  constructor(private readonly alertLogService: AlertLogService) {}

  @Get()
  async findAll(): Promise<AlertLogResponseDto[]> {
    return await this.alertLogService.findAll();
  }

  @Get('pending')
  async findPending(): Promise<AlertLogResponseDto[]> {
    return await this.alertLogService.findPending();
  }

  @Get('status/:status')
  async findByStatus(
    @Param('status') status: string,
  ): Promise<AlertLogResponseDto[]> {
    return await this.alertLogService.findByStatus(status);
  }

  @Get('alert-rule/:alertRuleId')
  async findByAlertRuleId(
    @Param('alertRuleId', ParseIntPipe) alertRuleId: number,
  ): Promise<AlertLogResponseDto[]> {
    return await this.alertLogService.findByAlertRuleId(alertRuleId);
  }

  @Get('entity/:entityType/:entityId')
  async findByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId', ParseIntPipe) entityId: number,
  ): Promise<AlertLogResponseDto[]> {
    return await this.alertLogService.findByEntity(entityType, entityId);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AlertLogResponseDto> {
    return await this.alertLogService.findById(id);
  }
}
