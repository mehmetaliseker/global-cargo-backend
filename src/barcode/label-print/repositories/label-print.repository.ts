import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  LabelConfigurationEntity,
  ILabelConfigurationRepository,
  LabelPrintHistoryEntity,
  ILabelPrintHistoryRepository,
} from './label-print.repository.interface';

@Injectable()
export class LabelConfigurationRepository
  implements ILabelConfigurationRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<LabelConfigurationEntity[]> {
    const query = `
      SELECT id, uuid, label_template_id, cargo_id, configuration_data,
             printer_settings, language_code, created_at, updated_at, deleted_at
      FROM label_configuration
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<LabelConfigurationEntity>(query);
  }

  async findById(id: number): Promise<LabelConfigurationEntity | null> {
    const query = `
      SELECT id, uuid, label_template_id, cargo_id, configuration_data,
             printer_settings, language_code, created_at, updated_at, deleted_at
      FROM label_configuration
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<LabelConfigurationEntity>(
      query,
      [id],
    );
  }

  async findByUuid(uuid: string): Promise<LabelConfigurationEntity | null> {
    const query = `
      SELECT id, uuid, label_template_id, cargo_id, configuration_data,
             printer_settings, language_code, created_at, updated_at, deleted_at
      FROM label_configuration
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<LabelConfigurationEntity>(
      query,
      [uuid],
    );
  }

  async findByLabelTemplateId(
    labelTemplateId: number,
  ): Promise<LabelConfigurationEntity[]> {
    const query = `
      SELECT id, uuid, label_template_id, cargo_id, configuration_data,
             printer_settings, language_code, created_at, updated_at, deleted_at
      FROM label_configuration
      WHERE label_template_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<LabelConfigurationEntity>(query, [
      labelTemplateId,
    ]);
  }

  async findByCargoId(
    cargoId: number,
  ): Promise<LabelConfigurationEntity[]> {
    const query = `
      SELECT id, uuid, label_template_id, cargo_id, configuration_data,
             printer_settings, language_code, created_at, updated_at, deleted_at
      FROM label_configuration
      WHERE cargo_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<LabelConfigurationEntity>(query, [
      cargoId,
    ]);
  }
}

@Injectable()
export class LabelPrintHistoryRepository
  implements ILabelPrintHistoryRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<LabelPrintHistoryEntity[]> {
    const query = `
      SELECT id, label_configuration_id, print_status, printer_info, print_date,
             print_count, error_message, print_duration_ms, created_at
      FROM label_print_history
      ORDER BY print_date DESC
    `;
    return await this.databaseService.query<LabelPrintHistoryEntity>(query);
  }

  async findById(id: number): Promise<LabelPrintHistoryEntity | null> {
    const query = `
      SELECT id, label_configuration_id, print_status, printer_info, print_date,
             print_count, error_message, print_duration_ms, created_at
      FROM label_print_history
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<LabelPrintHistoryEntity>(
      query,
      [id],
    );
  }

  async findByLabelConfigurationId(
    labelConfigurationId: number,
  ): Promise<LabelPrintHistoryEntity[]> {
    const query = `
      SELECT id, label_configuration_id, print_status, printer_info, print_date,
             print_count, error_message, print_duration_ms, created_at
      FROM label_print_history
      WHERE label_configuration_id = $1
      ORDER BY print_date DESC
    `;
    return await this.databaseService.query<LabelPrintHistoryEntity>(query, [
      labelConfigurationId,
    ]);
  }

  async findByPrintStatus(
    printStatus: string,
  ): Promise<LabelPrintHistoryEntity[]> {
    const query = `
      SELECT id, label_configuration_id, print_status, printer_info, print_date,
             print_count, error_message, print_duration_ms, created_at
      FROM label_print_history
      WHERE print_status = $1
      ORDER BY print_date DESC
    `;
    return await this.databaseService.query<LabelPrintHistoryEntity>(query, [
      printStatus,
    ]);
  }

  async findByPrintDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<LabelPrintHistoryEntity[]> {
    const query = `
      SELECT id, label_configuration_id, print_status, printer_info, print_date,
             print_count, error_message, print_duration_ms, created_at
      FROM label_print_history
      WHERE print_date >= $1 AND print_date <= $2
      ORDER BY print_date DESC
    `;
    return await this.databaseService.query<LabelPrintHistoryEntity>(query, [
      startDate,
      endDate,
    ]);
  }

  async findFailed(): Promise<LabelPrintHistoryEntity[]> {
    const query = `
      SELECT id, label_configuration_id, print_status, printer_info, print_date,
             print_count, error_message, print_duration_ms, created_at
      FROM label_print_history
      WHERE print_status = 'failed'
      ORDER BY print_date DESC
    `;
    return await this.databaseService.query<LabelPrintHistoryEntity>(query);
  }

  async findSuccessful(): Promise<LabelPrintHistoryEntity[]> {
    const query = `
      SELECT id, label_configuration_id, print_status, printer_info, print_date,
             print_count, error_message, print_duration_ms, created_at
      FROM label_print_history
      WHERE print_status = 'success'
      ORDER BY print_date DESC
    `;
    return await this.databaseService.query<LabelPrintHistoryEntity>(query);
  }
}
