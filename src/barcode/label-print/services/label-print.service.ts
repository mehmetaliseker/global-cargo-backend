import { Injectable, NotFoundException } from '@nestjs/common';
import { LabelConfigurationRepository } from '../repositories/label-print.repository';
import { LabelPrintHistoryRepository } from '../repositories/label-print.repository';
import {
  LabelConfigurationResponseDto,
  LabelPrintHistoryResponseDto,
} from '../dto/label-print.dto';
import {
  LabelConfigurationEntity,
  LabelPrintHistoryEntity,
} from '../repositories/label-print.repository.interface';

@Injectable()
export class LabelConfigurationService {
  constructor(
    private readonly labelConfigurationRepository: LabelConfigurationRepository,
  ) {}

  private mapToDto(
    entity: LabelConfigurationEntity,
  ): LabelConfigurationResponseDto {
    let configurationData: Record<string, unknown> = {};
    if (entity.configuration_data) {
      if (typeof entity.configuration_data === 'string') {
        configurationData = JSON.parse(entity.configuration_data);
      } else {
        configurationData = entity.configuration_data as Record<
          string,
          unknown
        >;
      }
    }

    let printerSettings: Record<string, unknown> | undefined = undefined;
    if (entity.printer_settings) {
      if (typeof entity.printer_settings === 'string') {
        printerSettings = JSON.parse(entity.printer_settings);
      } else {
        printerSettings = entity.printer_settings as Record<string, unknown>;
      }
    }

    return {
      id: entity.id,
      uuid: entity.uuid,
      labelTemplateId: entity.label_template_id,
      cargoId: entity.cargo_id ?? undefined,
      configurationData,
      printerSettings,
      languageCode: entity.language_code ?? undefined,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<LabelConfigurationResponseDto[]> {
    const entities = await this.labelConfigurationRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<LabelConfigurationResponseDto> {
    const entity = await this.labelConfigurationRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Label configuration with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<LabelConfigurationResponseDto> {
    const entity = await this.labelConfigurationRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(
        `Label configuration with uuid ${uuid} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByLabelTemplateId(
    labelTemplateId: number,
  ): Promise<LabelConfigurationResponseDto[]> {
    const entities =
      await this.labelConfigurationRepository.findByLabelTemplateId(
        labelTemplateId,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCargoId(
    cargoId: number,
  ): Promise<LabelConfigurationResponseDto[]> {
    const entities =
      await this.labelConfigurationRepository.findByCargoId(cargoId);
    return entities.map((entity) => this.mapToDto(entity));
  }
}

@Injectable()
export class LabelPrintHistoryService {
  constructor(
    private readonly labelPrintHistoryRepository: LabelPrintHistoryRepository,
  ) {}

  private mapToDto(
    entity: LabelPrintHistoryEntity,
  ): LabelPrintHistoryResponseDto {
    return {
      id: entity.id,
      labelConfigurationId: entity.label_configuration_id,
      printStatus: entity.print_status,
      printerInfo: entity.printer_info ?? undefined,
      printDate: entity.print_date.toISOString(),
      printCount: entity.print_count,
      errorMessage: entity.error_message ?? undefined,
      printDurationMs: entity.print_duration_ms ?? undefined,
      createdAt: entity.created_at.toISOString(),
    };
  }

  async findAll(): Promise<LabelPrintHistoryResponseDto[]> {
    const entities = await this.labelPrintHistoryRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<LabelPrintHistoryResponseDto> {
    const entity = await this.labelPrintHistoryRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Label print history with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByLabelConfigurationId(
    labelConfigurationId: number,
  ): Promise<LabelPrintHistoryResponseDto[]> {
    const entities =
      await this.labelPrintHistoryRepository.findByLabelConfigurationId(
        labelConfigurationId,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByPrintStatus(
    printStatus: string,
  ): Promise<LabelPrintHistoryResponseDto[]> {
    const entities =
      await this.labelPrintHistoryRepository.findByPrintStatus(printStatus);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByPrintDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<LabelPrintHistoryResponseDto[]> {
    const entities =
      await this.labelPrintHistoryRepository.findByPrintDateRange(
        startDate,
        endDate,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findFailed(): Promise<LabelPrintHistoryResponseDto[]> {
    const entities = await this.labelPrintHistoryRepository.findFailed();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findSuccessful(): Promise<LabelPrintHistoryResponseDto[]> {
    const entities = await this.labelPrintHistoryRepository.findSuccessful();
    return entities.map((entity) => this.mapToDto(entity));
  }
}
