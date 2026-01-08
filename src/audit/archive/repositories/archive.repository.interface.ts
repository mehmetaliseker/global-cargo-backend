export interface ArchiveEntity {
  id: number;
  uuid: string;
  source_table_name: string;
  source_record_id: number;
  source_record_uuid?: string;
  archive_type: string;
  archive_data: Record<string, unknown>;
  archive_date: Date;
  archived_by?: number;
  archive_reason?: string;
  created_at: Date;
}

export interface IArchiveRepository {
  findAll(): Promise<ArchiveEntity[]>;
  findById(id: number): Promise<ArchiveEntity | null>;
  findByUuid(uuid: string): Promise<ArchiveEntity | null>;
  findBySourceTable(sourceTableName: string): Promise<ArchiveEntity[]>;
  findBySourceRecord(
    sourceTableName: string,
    sourceRecordId: number,
  ): Promise<ArchiveEntity[]>;
  findBySourceRecordUuid(
    sourceTableName: string,
    sourceRecordUuid: string,
  ): Promise<ArchiveEntity[]>;
  findByArchiveType(archiveType: string): Promise<ArchiveEntity[]>;
  findByArchiveDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<ArchiveEntity[]>;
  findByArchivedBy(employeeId: number): Promise<ArchiveEntity[]>;
}
