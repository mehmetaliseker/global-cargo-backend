import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { BackupLogService } from '../services/backup-log.service';
import { BackupLogResponseDto } from '../dto/backup-log.dto';

@Controller('system/backup-logs')
export class BackupLogController {
  constructor(private readonly backupLogService: BackupLogService) {}

  // TODO: Add AdminGuard for write operations in future migrations

  @Get()
  async findAll(): Promise<BackupLogResponseDto[]> {
    return await this.backupLogService.findAll();
  }

  @Get('type/:backupType')
  async findByBackupType(
    @Param('backupType') backupType: string,
  ): Promise<BackupLogResponseDto[]> {
    return await this.backupLogService.findByBackupType(backupType);
  }

  @Get('status/:status')
  async findByStatus(
    @Param('status') status: string,
  ): Promise<BackupLogResponseDto[]> {
    return await this.backupLogService.findByStatus(status);
  }

  @Get('date-range')
  async findByExecutionDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<BackupLogResponseDto[]> {
    return await this.backupLogService.findByExecutionDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BackupLogResponseDto> {
    return await this.backupLogService.findById(id);
  }
}
