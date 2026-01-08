export interface BackupLogEntity {
  id: number;
  backup_type: string;
  execution_date: Date;
  status: string;
  file_path?: string;
  file_size_bytes?: number;
  duration_seconds?: number;
  restore_test_date?: Date;
  restore_test_status?: string;
  restore_test_details?: string;
  created_at: Date;
  updated_at: Date;
}

export interface IBackupLogRepository {
  findAll(): Promise<BackupLogEntity[]>;
  findById(id: number): Promise<BackupLogEntity | null>;
  findByBackupType(backupType: string): Promise<BackupLogEntity[]>;
  findByStatus(status: string): Promise<BackupLogEntity[]>;
  findByExecutionDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<BackupLogEntity[]>;
}
