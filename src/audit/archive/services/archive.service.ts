import { Injectable, BadRequestException } from '@nestjs/common';
import { ArchiveRepository } from '../repositories/archive.repository';
import {
  ArchiveResponseDto,
  ArchiveQueryDto,
} from '../dto/archive.dto';
import { ArchiveEntity } from '../repositories/archive.repository.interface';

@Injectable()
export class ArchiveService {
  constructor(private readonly archiveRepository: ArchiveRepository) {}

  private mapToDto(entity: ArchiveEntity): ArchiveResponseDto {
    let archiveData: Record<string, unknown>;
    if (typeof entity.archive_data === 'string') {
      archiveData = JSON.parse(entity.archive_data);
    } else {
      archiveData = entity.archive_data as Record<string, unknown>;
    }

    return {
      id: entity.id,
      uuid: entity.uuid,
      sourceTableName: entity.source_table_name,
      sourceRecordId: entity.source_record_id,
      sourceRecordUuid: entity.source_record_uuid ?? undefined,
      archiveType: entity.archive_type,
      archiveData,
      archiveDate: entity.archive_date.toISOString(),
      archivedBy: entity.archived_by ?? undefined,
      archiveReason: entity.archive_reason ?? undefined,
      createdAt: entity.created_at.toISOString(),
    };
  }

  async findAll(): Promise<ArchiveResponseDto[]> {
    const entities = await this.archiveRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<ArchiveResponseDto> {
    const entity = await this.archiveRepository.findById(id);
    if (!entity) {
      throw new BadRequestException(`Archive record with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<ArchiveResponseDto> {
    const entity = await this.archiveRepository.findByUuid(uuid);
    if (!entity) {
      throw new BadRequestException(`Archive record with uuid ${uuid} not found`);
    }
    return this.mapToDto(entity);
  }

  async findBySourceTable(
    sourceTableName: string,
  ): Promise<ArchiveResponseDto[]> {
    const entities =
      await this.archiveRepository.findBySourceTable(sourceTableName);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findBySourceRecord(
    sourceTableName: string,
    sourceRecordId: number,
  ): Promise<ArchiveResponseDto[]> {
    const entities = await this.archiveRepository.findBySourceRecord(
      sourceTableName,
      sourceRecordId,
    );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findBySourceRecordUuid(
    sourceTableName: string,
    sourceRecordUuid: string,
  ): Promise<ArchiveResponseDto[]> {
    const entities = await this.archiveRepository.findBySourceRecordUuid(
      sourceTableName,
      sourceRecordUuid,
    );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByArchiveType(archiveType: string): Promise<ArchiveResponseDto[]> {
    const entities = await this.archiveRepository.findByArchiveType(archiveType);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByArchiveDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<ArchiveResponseDto[]> {
    if (startDate > endDate) {
      throw new BadRequestException('Start date must be before end date');
    }
    const entities = await this.archiveRepository.findByArchiveDateRange(
      startDate,
      endDate,
    );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByArchivedBy(employeeId: number): Promise<ArchiveResponseDto[]> {
    const entities = await this.archiveRepository.findByArchivedBy(employeeId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async query(queryDto: ArchiveQueryDto): Promise<ArchiveResponseDto[]> {
    if (queryDto.sourceTableName && queryDto.sourceRecordId) {
      return await this.findBySourceRecord(
        queryDto.sourceTableName,
        queryDto.sourceRecordId,
      );
    }
    if (queryDto.sourceTableName && queryDto.sourceRecordUuid) {
      return await this.findBySourceRecordUuid(
        queryDto.sourceTableName,
        queryDto.sourceRecordUuid,
      );
    }
    if (queryDto.startDate && queryDto.endDate) {
      return await this.findByArchiveDateRange(
        new Date(queryDto.startDate),
        new Date(queryDto.endDate),
      );
    }
    if (queryDto.sourceTableName) {
      return await this.findBySourceTable(queryDto.sourceTableName);
    }
    if (queryDto.archiveType) {
      return await this.findByArchiveType(queryDto.archiveType);
    }
    if (queryDto.archivedBy) {
      return await this.findByArchivedBy(queryDto.archivedBy);
    }
    return await this.findAll();
  }
}
