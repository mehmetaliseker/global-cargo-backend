import { Injectable, BadRequestException } from '@nestjs/common';
import { ChangeDataCaptureRepository } from '../repositories/change-data-capture.repository';
import {
  ChangeDataCaptureResponseDto,
  ChangeDataCaptureQueryDto,
} from '../dto/change-data-capture.dto';
import { ChangeDataCaptureEntity } from '../repositories/change-data-capture.repository.interface';

@Injectable()
export class ChangeDataCaptureService {
  constructor(
    private readonly changeDataCaptureRepository: ChangeDataCaptureRepository,
  ) {}

  private mapToDto(
    entity: ChangeDataCaptureEntity,
  ): ChangeDataCaptureResponseDto {
    let changeData: Record<string, unknown>;
    if (typeof entity.change_data === 'string') {
      changeData = JSON.parse(entity.change_data);
    } else {
      changeData = entity.change_data as Record<string, unknown>;
    }

    return {
      id: entity.id,
      sourceTable: entity.source_table,
      sourceRecordId: entity.source_record_id,
      sourceRecordUuid: entity.source_record_uuid ?? undefined,
      changeType: entity.change_type,
      changeData,
      changeTimestamp: entity.change_timestamp.toISOString(),
      processed: entity.processed,
      processedAt: entity.processed_at?.toISOString(),
      createdAt: entity.created_at.toISOString(),
    };
  }

  async findAll(): Promise<ChangeDataCaptureResponseDto[]> {
    const entities = await this.changeDataCaptureRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<ChangeDataCaptureResponseDto> {
    const entity = await this.changeDataCaptureRepository.findById(id);
    if (!entity) {
      throw new BadRequestException(
        `Change data capture record with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findBySourceTable(
    sourceTable: string,
  ): Promise<ChangeDataCaptureResponseDto[]> {
    const entities =
      await this.changeDataCaptureRepository.findBySourceTable(sourceTable);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findBySourceRecord(
    sourceTable: string,
    sourceRecordId: number,
  ): Promise<ChangeDataCaptureResponseDto[]> {
    const entities = await this.changeDataCaptureRepository.findBySourceRecord(
      sourceTable,
      sourceRecordId,
    );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findBySourceRecordUuid(
    sourceTable: string,
    sourceRecordUuid: string,
  ): Promise<ChangeDataCaptureResponseDto[]> {
    const entities =
      await this.changeDataCaptureRepository.findBySourceRecordUuid(
        sourceTable,
        sourceRecordUuid,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByChangeType(
    changeType: string,
  ): Promise<ChangeDataCaptureResponseDto[]> {
    const entities =
      await this.changeDataCaptureRepository.findByChangeType(changeType);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findUnprocessed(): Promise<ChangeDataCaptureResponseDto[]> {
    const entities = await this.changeDataCaptureRepository.findUnprocessed();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByProcessed(
    processed: boolean,
  ): Promise<ChangeDataCaptureResponseDto[]> {
    const entities =
      await this.changeDataCaptureRepository.findByProcessed(processed);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByChangeTimestampRange(
    startDate: Date,
    endDate: Date,
  ): Promise<ChangeDataCaptureResponseDto[]> {
    if (startDate > endDate) {
      throw new BadRequestException('Start date must be before end date');
    }
    const entities =
      await this.changeDataCaptureRepository.findByChangeTimestampRange(
        startDate,
        endDate,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async query(
    queryDto: ChangeDataCaptureQueryDto,
  ): Promise<ChangeDataCaptureResponseDto[]> {
    if (queryDto.sourceTable && queryDto.sourceRecordId) {
      return await this.findBySourceRecord(
        queryDto.sourceTable,
        queryDto.sourceRecordId,
      );
    }
    if (queryDto.sourceTable && queryDto.sourceRecordUuid) {
      return await this.findBySourceRecordUuid(
        queryDto.sourceTable,
        queryDto.sourceRecordUuid,
      );
    }
    if (queryDto.startDate && queryDto.endDate) {
      return await this.findByChangeTimestampRange(
        new Date(queryDto.startDate),
        new Date(queryDto.endDate),
      );
    }
    if (queryDto.processed === false) {
      return await this.findUnprocessed();
    }
    if (queryDto.processed !== undefined) {
      return await this.findByProcessed(queryDto.processed);
    }
    if (queryDto.sourceTable) {
      return await this.findBySourceTable(queryDto.sourceTable);
    }
    if (queryDto.changeType) {
      return await this.findByChangeType(queryDto.changeType);
    }
    return await this.findAll();
  }
}
