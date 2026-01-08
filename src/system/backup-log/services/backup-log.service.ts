import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { BackupLogRepository } from '../repositories/backup-log.repository';
import { BackupLogResponseDto } from '../dto/backup-log.dto';
import { BackupLogEntity } from '../repositories/backup-log.repository.interface';

@Injectable()
export class BackupLogService {
  constructor(private readonly backupLogRepository: BackupLogRepository) {}

  private mapToDto(entity: BackupLogEntity): BackupLogResponseDto {
    return {
      id: entity.id,
      backupType: entity.backup_type,
      executionDate: entity.execution_date.toISOString(),
      status: entity.status,
      filePath: entity.file_path ?? undefined,
      fileSizeBytes: entity.file_size_bytes
        ? parseInt(entity.file_size_bytes.toString(), 10)
        : undefined,
      durationSeconds: entity.duration_seconds ?? undefined,
      restoreTestDate: entity.restore_test_date?.toISOString(),
      restoreTestStatus: entity.restore_test_status ?? undefined,
      restoreTestDetails: entity.restore_test_details ?? undefined,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
    };
  }

  async findAll(): Promise<BackupLogResponseDto[]> {
    const entities = await this.backupLogRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<BackupLogResponseDto> {
    const entity = await this.backupLogRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Backup log with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByBackupType(backupType: string): Promise<BackupLogResponseDto[]> {
    const entities = await this.backupLogRepository.findByBackupType(backupType);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByStatus(status: string): Promise<BackupLogResponseDto[]> {
    const entities = await this.backupLogRepository.findByStatus(status);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByExecutionDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<BackupLogResponseDto[]> {
    if (startDate > endDate) {
      throw new BadRequestException('Start date must be before end date');
    }
    const entities = await this.backupLogRepository.findByExecutionDateRange(
      startDate,
      endDate,
    );
    return entities.map((entity) => this.mapToDto(entity));
  }
}
