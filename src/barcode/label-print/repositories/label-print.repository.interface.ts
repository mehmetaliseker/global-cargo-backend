export interface LabelConfigurationEntity {
  id: number;
  uuid: string;
  label_template_id: number;
  cargo_id?: number;
  configuration_data: Record<string, unknown>;
  printer_settings?: Record<string, unknown>;
  language_code?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface LabelPrintHistoryEntity {
  id: number;
  label_configuration_id: number;
  print_status: string;
  printer_info?: string;
  print_date: Date;
  print_count: number;
  error_message?: string;
  print_duration_ms?: number;
  created_at: Date;
}

export interface ILabelConfigurationRepository {
  findAll(): Promise<LabelConfigurationEntity[]>;
  findById(id: number): Promise<LabelConfigurationEntity | null>;
  findByUuid(uuid: string): Promise<LabelConfigurationEntity | null>;
  findByLabelTemplateId(labelTemplateId: number): Promise<LabelConfigurationEntity[]>;
  findByCargoId(cargoId: number): Promise<LabelConfigurationEntity[]>;
}

export interface ILabelPrintHistoryRepository {
  findAll(): Promise<LabelPrintHistoryEntity[]>;
  findById(id: number): Promise<LabelPrintHistoryEntity | null>;
  findByLabelConfigurationId(
    labelConfigurationId: number,
  ): Promise<LabelPrintHistoryEntity[]>;
  findByPrintStatus(printStatus: string): Promise<LabelPrintHistoryEntity[]>;
  findByPrintDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<LabelPrintHistoryEntity[]>;
  findFailed(): Promise<LabelPrintHistoryEntity[]>;
  findSuccessful(): Promise<LabelPrintHistoryEntity[]>;
}
