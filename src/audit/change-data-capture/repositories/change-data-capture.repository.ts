import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  ChangeDataCaptureEntity,
  IChangeDataCaptureRepository,
} from './change-data-capture.repository.interface';

@Injectable()
export class ChangeDataCaptureRepository
  implements IChangeDataCaptureRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<ChangeDataCaptureEntity[]> {
    const query = `
      SELECT id, source_table, source_record_id, source_record_uuid, change_type,
             change_data, change_timestamp, processed, processed_at, created_at
      FROM change_data_capture
      ORDER BY change_timestamp DESC
      LIMIT 1000
    `;
    return await this.databaseService.query<ChangeDataCaptureEntity>(query);
  }

  async findById(id: number): Promise<ChangeDataCaptureEntity | null> {
    const query = `
      SELECT id, source_table, source_record_id, source_record_uuid, change_type,
             change_data, change_timestamp, processed, processed_at, created_at
      FROM change_data_capture
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<ChangeDataCaptureEntity>(
      query,
      [id],
    );
  }

  async findBySourceTable(sourceTable: string): Promise<ChangeDataCaptureEntity[]> {
    const query = `
      SELECT id, source_table, source_record_id, source_record_uuid, change_type,
             change_data, change_timestamp, processed, processed_at, created_at
      FROM change_data_capture
      WHERE source_table = $1
      ORDER BY change_timestamp DESC
      LIMIT 1000
    `;
    return await this.databaseService.query<ChangeDataCaptureEntity>(query, [
      sourceTable,
    ]);
  }

  async findBySourceRecord(
    sourceTable: string,
    sourceRecordId: number,
  ): Promise<ChangeDataCaptureEntity[]> {
    const query = `
      SELECT id, source_table, source_record_id, source_record_uuid, change_type,
             change_data, change_timestamp, processed, processed_at, created_at
      FROM change_data_capture
      WHERE source_table = $1 AND source_record_id = $2
      ORDER BY change_timestamp ASC
    `;
    return await this.databaseService.query<ChangeDataCaptureEntity>(query, [
      sourceTable,
      sourceRecordId,
    ]);
  }

  async findBySourceRecordUuid(
    sourceTable: string,
    sourceRecordUuid: string,
  ): Promise<ChangeDataCaptureEntity[]> {
    const query = `
      SELECT id, source_table, source_record_id, source_record_uuid, change_type,
             change_data, change_timestamp, processed, processed_at, created_at
      FROM change_data_capture
      WHERE source_table = $1 AND source_record_uuid = $2
      ORDER BY change_timestamp ASC
    `;
    return await this.databaseService.query<ChangeDataCaptureEntity>(query, [
      sourceTable,
      sourceRecordUuid,
    ]);
  }

  async findByChangeType(changeType: string): Promise<ChangeDataCaptureEntity[]> {
    const query = `
      SELECT id, source_table, source_record_id, source_record_uuid, change_type,
             change_data, change_timestamp, processed, processed_at, created_at
      FROM change_data_capture
      WHERE change_type = $1
      ORDER BY change_timestamp DESC
      LIMIT 1000
    `;
    return await this.databaseService.query<ChangeDataCaptureEntity>(query, [
      changeType,
    ]);
  }

  async findUnprocessed(): Promise<ChangeDataCaptureEntity[]> {
    const query = `
      SELECT id, source_table, source_record_id, source_record_uuid, change_type,
             change_data, change_timestamp, processed, processed_at, created_at
      FROM change_data_capture
      WHERE processed = false
      ORDER BY change_timestamp ASC
      LIMIT 1000
    `;
    return await this.databaseService.query<ChangeDataCaptureEntity>(query);
  }

  async findByProcessed(processed: boolean): Promise<ChangeDataCaptureEntity[]> {
    const query = `
      SELECT id, source_table, source_record_id, source_record_uuid, change_type,
             change_data, change_timestamp, processed, processed_at, created_at
      FROM change_data_capture
      WHERE processed = $1
      ORDER BY change_timestamp DESC
      LIMIT 1000
    `;
    return await this.databaseService.query<ChangeDataCaptureEntity>(query, [
      processed,
    ]);
  }

  async findByChangeTimestampRange(
    startDate: Date,
    endDate: Date,
  ): Promise<ChangeDataCaptureEntity[]> {
    const query = `
      SELECT id, source_table, source_record_id, source_record_uuid, change_type,
             change_data, change_timestamp, processed, processed_at, created_at
      FROM change_data_capture
      WHERE change_timestamp >= $1 AND change_timestamp <= $2
      ORDER BY change_timestamp DESC
      LIMIT 5000
    `;
    return await this.databaseService.query<ChangeDataCaptureEntity>(query, [
      startDate,
      endDate,
    ]);
  }
}
