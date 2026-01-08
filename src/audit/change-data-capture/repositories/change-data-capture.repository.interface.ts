export interface ChangeDataCaptureEntity {
  id: number;
  source_table: string;
  source_record_id: number;
  source_record_uuid?: string;
  change_type: string;
  change_data: Record<string, unknown>;
  change_timestamp: Date;
  processed: boolean;
  processed_at?: Date;
  created_at: Date;
}

export interface IChangeDataCaptureRepository {
  findAll(): Promise<ChangeDataCaptureEntity[]>;
  findById(id: number): Promise<ChangeDataCaptureEntity | null>;
  findBySourceTable(sourceTable: string): Promise<ChangeDataCaptureEntity[]>;
  findBySourceRecord(
    sourceTable: string,
    sourceRecordId: number,
  ): Promise<ChangeDataCaptureEntity[]>;
  findBySourceRecordUuid(
    sourceTable: string,
    sourceRecordUuid: string,
  ): Promise<ChangeDataCaptureEntity[]>;
  findByChangeType(changeType: string): Promise<ChangeDataCaptureEntity[]>;
  findUnprocessed(): Promise<ChangeDataCaptureEntity[]>;
  findByProcessed(processed: boolean): Promise<ChangeDataCaptureEntity[]>;
  findByChangeTimestampRange(
    startDate: Date,
    endDate: Date,
  ): Promise<ChangeDataCaptureEntity[]>;
}
