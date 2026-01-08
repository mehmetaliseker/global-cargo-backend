export interface LabelTemplateEntity {
  id: number;
  uuid: string;
  template_name: string;
  template_code: string;
  template_type: string;
  template_layout: Record<string, unknown>;
  supported_languages?: string[];
  default_language_code?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface ILabelTemplateRepository {
  findAll(): Promise<LabelTemplateEntity[]>;
  findById(id: number): Promise<LabelTemplateEntity | null>;
  findByUuid(uuid: string): Promise<LabelTemplateEntity | null>;
  findByCode(templateCode: string): Promise<LabelTemplateEntity | null>;
  findByType(templateType: string): Promise<LabelTemplateEntity[]>;
  findActive(): Promise<LabelTemplateEntity[]>;
}
