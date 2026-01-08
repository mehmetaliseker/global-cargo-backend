import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { SystemConfigService } from '../services/system-config.service';
import { SystemConfigResponseDto } from '../dto/system-config.dto';

@Controller('system/configs')
export class SystemConfigController {
  constructor(private readonly systemConfigService: SystemConfigService) {}

  // TODO: Add AdminGuard for write operations in future migrations

  @Get()
  async findAll(): Promise<SystemConfigResponseDto[]> {
    return await this.systemConfigService.findAll();
  }

  @Get('type/:configType')
  async findByType(
    @Param('configType') configType: string,
  ): Promise<SystemConfigResponseDto[]> {
    return await this.systemConfigService.findByType(configType);
  }

  @Get('key/:configKey')
  async findByKey(
    @Param('configKey') configKey: string,
  ): Promise<SystemConfigResponseDto | null> {
    return await this.systemConfigService.findByKey(configKey);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SystemConfigResponseDto> {
    return await this.systemConfigService.findById(id);
  }
}
