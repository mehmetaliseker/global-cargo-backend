import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  LabelTemplateEntity,
  ILabelTemplateRepository,
} from './label-template.repository.interface';

@Injectable()
export class LabelTemplateRepository implements ILabelTemplateRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<LabelTemplateEntity[]> {
    const query = `
      SELECT id, uuid, template_name, template_code, template_type, template_layout,
             supported_languages, default_language_code, is_active, created_at,
             updated_at, deleted_at
      FROM label_template
      WHERE deleted_at IS NULL
      ORDER BY template_name ASC
    `;
    return await this.databaseService.query<LabelTemplateEntity>(query);
  }

  async findById(id: number): Promise<LabelTemplateEntity | null> {
    const query = `
      SELECT id, uuid, template_name, template_code, template_type, template_layout,
             supported_languages, default_language_code, is_active, created_at,
             updated_at, deleted_at
      FROM label_template
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<LabelTemplateEntity>(query, [
      id,
    ]);
  }

  async findByUuid(uuid: string): Promise<LabelTemplateEntity | null> {
    const query = `
      SELECT id, uuid, template_name, template_code, template_type, template_layout,
             supported_languages, default_language_code, is_active, created_at,
             updated_at, deleted_at
      FROM label_template
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<LabelTemplateEntity>(query, [
      uuid,
    ]);
  }

  async findByCode(templateCode: string): Promise<LabelTemplateEntity | null> {
    const query = `
      SELECT id, uuid, template_name, template_code, template_type, template_layout,
             supported_languages, default_language_code, is_active, created_at,
             updated_at, deleted_at
      FROM label_template
      WHERE template_code = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<LabelTemplateEntity>(query, [
      templateCode,
    ]);
  }

  async findByType(templateType: string): Promise<LabelTemplateEntity[]> {
    const query = `
      SELECT id, uuid, template_name, template_code, template_type, template_layout,
             supported_languages, default_language_code, is_active, created_at,
             updated_at, deleted_at
      FROM label_template
      WHERE template_type = $1 AND deleted_at IS NULL
      ORDER BY template_name ASC
    `;
    return await this.databaseService.query<LabelTemplateEntity>(query, [
      templateType,
    ]);
  }

  async findActive(): Promise<LabelTemplateEntity[]> {
    const query = `
      SELECT id, uuid, template_name, template_code, template_type, template_layout,
             supported_languages, default_language_code, is_active, created_at,
             updated_at, deleted_at
      FROM label_template
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY template_name ASC
    `;
    return await this.databaseService.query<LabelTemplateEntity>(query);
  }
}
