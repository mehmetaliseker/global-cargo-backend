import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  ArchiveEntity,
  IArchiveRepository,
} from './archive.repository.interface';

@Injectable()
export class ArchiveRepository implements IArchiveRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<ArchiveEntity[]> {
    const query = `
      SELECT id, uuid, source_table_name, source_record_id, source_record_uuid,
             archive_type, archive_data, archive_date, archived_by, archive_reason, created_at
      FROM archive
      ORDER BY archive_date DESC
      LIMIT 1000
    `;
    return await this.databaseService.query<ArchiveEntity>(query);
  }

  async findById(id: number): Promise<ArchiveEntity | null> {
    const query = `
      SELECT id, uuid, source_table_name, source_record_id, source_record_uuid,
             archive_type, archive_data, archive_date, archived_by, archive_reason, created_at
      FROM archive
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<ArchiveEntity>(query, [id]);
  }

  async findByUuid(uuid: string): Promise<ArchiveEntity | null> {
    const query = `
      SELECT id, uuid, source_table_name, source_record_id, source_record_uuid,
             archive_type, archive_data, archive_date, archived_by, archive_reason, created_at
      FROM archive
      WHERE uuid = $1
    `;
    return await this.databaseService.queryOne<ArchiveEntity>(query, [uuid]);
  }

  async findBySourceTable(
    sourceTableName: string,
  ): Promise<ArchiveEntity[]> {
    const query = `
      SELECT id, uuid, source_table_name, source_record_id, source_record_uuid,
             archive_type, archive_data, archive_date, archived_by, archive_reason, created_at
      FROM archive
      WHERE source_table_name = $1
      ORDER BY archive_date DESC
      LIMIT 1000
    `;
    return await this.databaseService.query<ArchiveEntity>(query, [
      sourceTableName,
    ]);
  }

  async findBySourceRecord(
    sourceTableName: string,
    sourceRecordId: number,
  ): Promise<ArchiveEntity[]> {
    const query = `
      SELECT id, uuid, source_table_name, source_record_id, source_record_uuid,
             archive_type, archive_data, archive_date, archived_by, archive_reason, created_at
      FROM archive
      WHERE source_table_name = $1 AND source_record_id = $2
      ORDER BY archive_date DESC
    `;
    return await this.databaseService.query<ArchiveEntity>(query, [
      sourceTableName,
      sourceRecordId,
    ]);
  }

  async findBySourceRecordUuid(
    sourceTableName: string,
    sourceRecordUuid: string,
  ): Promise<ArchiveEntity[]> {
    const query = `
      SELECT id, uuid, source_table_name, source_record_id, source_record_uuid,
             archive_type, archive_data, archive_date, archived_by, archive_reason, created_at
      FROM archive
      WHERE source_table_name = $1 AND source_record_uuid = $2
      ORDER BY archive_date DESC
    `;
    return await this.databaseService.query<ArchiveEntity>(query, [
      sourceTableName,
      sourceRecordUuid,
    ]);
  }

  async findByArchiveType(archiveType: string): Promise<ArchiveEntity[]> {
    const query = `
      SELECT id, uuid, source_table_name, source_record_id, source_record_uuid,
             archive_type, archive_data, archive_date, archived_by, archive_reason, created_at
      FROM archive
      WHERE archive_type = $1
      ORDER BY archive_date DESC
      LIMIT 1000
    `;
    return await this.databaseService.query<ArchiveEntity>(query, [
      archiveType,
    ]);
  }

  async findByArchiveDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<ArchiveEntity[]> {
    const query = `
      SELECT id, uuid, source_table_name, source_record_id, source_record_uuid,
             archive_type, archive_data, archive_date, archived_by, archive_reason, created_at
      FROM archive
      WHERE archive_date >= $1 AND archive_date <= $2
      ORDER BY archive_date DESC
      LIMIT 5000
    `;
    return await this.databaseService.query<ArchiveEntity>(query, [
      startDate,
      endDate,
    ]);
  }

  async findByArchivedBy(employeeId: number): Promise<ArchiveEntity[]> {
    const query = `
      SELECT id, uuid, source_table_name, source_record_id, source_record_uuid,
             archive_type, archive_data, archive_date, archived_by, archive_reason, created_at
      FROM archive
      WHERE archived_by = $1
      ORDER BY archive_date DESC
      LIMIT 1000
    `;
    return await this.databaseService.query<ArchiveEntity>(query, [employeeId]);
  }
}
