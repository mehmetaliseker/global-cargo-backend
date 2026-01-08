import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { NotificationTemplateService } from '../services/notification-template.service';
import { NotificationTemplateResponseDto } from '../dto/notification-template.dto';

@Controller('notification/templates')
export class NotificationTemplateController {
  constructor(
    private readonly notificationTemplateService: NotificationTemplateService,
  ) {}

  @Get()
  async findAll(): Promise<NotificationTemplateResponseDto[]> {
    return await this.notificationTemplateService.findAll();
  }

  @Get('active')
  async findActive(): Promise<NotificationTemplateResponseDto[]> {
    return await this.notificationTemplateService.findActive();
  }

  @Get('type/:notificationType')
  async findByNotificationType(
    @Param('notificationType') notificationType: string,
  ): Promise<NotificationTemplateResponseDto[]> {
    return await this.notificationTemplateService.findByNotificationType(
      notificationType,
    );
  }

  @Get('language/:languageCode')
  async findByLanguageCode(
    @Param('languageCode') languageCode: string,
  ): Promise<NotificationTemplateResponseDto[]> {
    return await this.notificationTemplateService.findByLanguageCode(
      languageCode,
    );
  }

  @Get('code/:templateCode')
  async findByCode(
    @Param('templateCode') templateCode: string,
  ): Promise<NotificationTemplateResponseDto> {
    return await this.notificationTemplateService.findByCode(templateCode);
  }

  @Get('uuid/:uuid')
  async findByUuid(@Param('uuid') uuid: string): Promise<NotificationTemplateResponseDto> {
    return await this.notificationTemplateService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<NotificationTemplateResponseDto> {
    return await this.notificationTemplateService.findById(id);
  }
}
