import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { MaintenanceLogService } from '../services/maintenance-log.service';
import { MaintenanceLogResponseDto } from '../dto/maintenance-log.dto';

@Controller('system/maintenance-logs')
export class MaintenanceLogController {
  constructor(
    private readonly maintenanceLogService: MaintenanceLogService,
  ) {}

  // TODO: Add AdminGuard for write operations in future migrations

  @Get()
  async findAll(): Promise<MaintenanceLogResponseDto[]> {
    return await this.maintenanceLogService.findAll();
  }

  @Get('type/:maintenanceType')
  async findByMaintenanceType(
    @Param('maintenanceType') maintenanceType: string,
  ): Promise<MaintenanceLogResponseDto[]> {
    return await this.maintenanceLogService.findByMaintenanceType(
      maintenanceType,
    );
  }

  @Get('status/:status')
  async findByStatus(
    @Param('status') status: string,
  ): Promise<MaintenanceLogResponseDto[]> {
    return await this.maintenanceLogService.findByStatus(status);
  }

  @Get('date-range')
  async findByExecutionDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<MaintenanceLogResponseDto[]> {
    return await this.maintenanceLogService.findByExecutionDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MaintenanceLogResponseDto> {
    return await this.maintenanceLogService.findById(id);
  }
}
