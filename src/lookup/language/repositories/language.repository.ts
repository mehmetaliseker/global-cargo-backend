import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  LanguageEntity,
  ILanguageRepository,
} from './language.repository.interface';

@Injectable()
export class LanguageRepository implements ILanguageRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<LanguageEntity[]> {
    const query = `
      SELECT language_code, language_name, native_name, is_active, is_default, created_at, deleted_at
      FROM language
      WHERE deleted_at IS NULL
      ORDER BY language_code ASC
    `;
    return await this.databaseService.query<LanguageEntity>(query);
  }

  async findByCode(languageCode: string): Promise<LanguageEntity | null> {
    const query = `
      SELECT language_code, language_name, native_name, is_active, is_default, created_at, deleted_at
      FROM language
      WHERE language_code = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<LanguageEntity>(query, [
      languageCode,
    ]);
  }

  async findActive(): Promise<LanguageEntity[]> {
    const query = `
      SELECT language_code, language_name, native_name, is_active, is_default, created_at, deleted_at
      FROM language
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY language_code ASC
    `;
    return await this.databaseService.query<LanguageEntity>(query);
  }

  async findDefault(): Promise<LanguageEntity | null> {
    const query = `
      SELECT language_code, language_name, native_name, is_active, is_default, created_at, deleted_at
      FROM language
      WHERE is_default = true AND deleted_at IS NULL
      LIMIT 1
    `;
    return await this.databaseService.queryOne<LanguageEntity>(query);
  }
}

