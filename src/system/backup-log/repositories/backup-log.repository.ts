import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  BackupLogEntity,
  IBackupLogRepository,
} from './backup-log.repository.interface';

@Injectable()
export class BackupLogRepository implements IBackupLogRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<BackupLogEntity[]> {
    const query = `
      SELECT id, backup_type, execution_date, status, file_path, file_size_bytes,
             duration_seconds, restore_test_date, restore_test_status,
             restore_test_details, created_at, updated_at
      FROM backup_log
      ORDER BY execution_date DESC
      LIMIT 1000
    `;
    return await this.databaseService.query<BackupLogEntity>(query);
  }

  async findById(id: number): Promise<BackupLogEntity | null> {
    const query = `
      SELECT id, backup_type, execution_date, status, file_path, file_size_bytes,
             duration_seconds, restore_test_date, restore_test_status,
             restore_test_details, created_at, updated_at
      FROM backup_log
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<BackupLogEntity>(query, [id]);
  }

  async findByBackupType(backupType: string): Promise<BackupLogEntity[]> {
    const query = `
      SELECT id, backup_type, execution_date, status, file_path, file_size_bytes,
             duration_seconds, restore_test_date, restore_test_status,
             restore_test_details, created_at, updated_at
      FROM backup_log
      WHERE backup_type = $1
      ORDER BY execution_date DESC
      LIMIT 1000
    `;
    return await this.databaseService.query<BackupLogEntity>(query, [
      backupType,
    ]);
  }

  async findByStatus(status: string): Promise<BackupLogEntity[]> {
    const query = `
      SELECT id, backup_type, execution_date, status, file_path, file_size_bytes,
             duration_seconds, restore_test_date, restore_test_status,
             restore_test_details, created_at, updated_at
      FROM backup_log
      WHERE status = $1
      ORDER BY execution_date DESC
      LIMIT 1000
    `;
    return await this.databaseService.query<BackupLogEntity>(query, [status]);
  }

  async findByExecutionDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<BackupLogEntity[]> {
    const query = `
      SELECT id, backup_type, execution_date, status, file_path, file_size_bytes,
             duration_seconds, restore_test_date, restore_test_status,
             restore_test_details, created_at, updated_at
      FROM backup_log
      WHERE execution_date >= $1 AND execution_date <= $2
      ORDER BY execution_date DESC
      LIMIT 5000
    `;
    return await this.databaseService.query<BackupLogEntity>(query, [
      startDate,
      endDate,
    ]);
  }
}
