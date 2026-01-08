import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
    TranslationEntity,
    ITranslationRepository,
} from './translation.repository.interface';

@Injectable()
export class TranslationRepository implements ITranslationRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findAll(): Promise<TranslationEntity[]> {
        const query = `
      SELECT id, translation_key, language_code, translation_value,
             context, is_approved, created_at, updated_at, deleted_at
      FROM translation
      WHERE deleted_at IS NULL
      ORDER BY translation_key ASC, language_code ASC
    `;
        return await this.databaseService.query<TranslationEntity>(query);
    }

    async findById(id: number): Promise<TranslationEntity | null> {
        const query = `
      SELECT id, translation_key, language_code, translation_value,
             context, is_approved, created_at, updated_at, deleted_at
      FROM translation
      WHERE id = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<TranslationEntity>(query, [id]);
    }

    async findByKey(translationKey: string): Promise<TranslationEntity[]> {
        const query = `
      SELECT id, translation_key, language_code, translation_value,
             context, is_approved, created_at, updated_at, deleted_at
      FROM translation
      WHERE translation_key = $1 AND deleted_at IS NULL
      ORDER BY language_code ASC
    `;
        return await this.databaseService.query<TranslationEntity>(query, [translationKey]);
    }

    async findByKeyAndLanguage(translationKey: string, languageCode: string): Promise<TranslationEntity | null> {
        const query = `
      SELECT id, translation_key, language_code, translation_value,
             context, is_approved, created_at, updated_at, deleted_at
      FROM translation
      WHERE translation_key = $1 AND language_code = $2 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<TranslationEntity>(query, [translationKey, languageCode]);
    }

    async findByLanguage(languageCode: string): Promise<TranslationEntity[]> {
        const query = `
      SELECT id, translation_key, language_code, translation_value,
             context, is_approved, created_at, updated_at, deleted_at
      FROM translation
      WHERE language_code = $1 AND deleted_at IS NULL
      ORDER BY translation_key ASC
    `;
        return await this.databaseService.query<TranslationEntity>(query, [languageCode]);
    }

    async findByContext(context: string): Promise<TranslationEntity[]> {
        const query = `
      SELECT id, translation_key, language_code, translation_value,
             context, is_approved, created_at, updated_at, deleted_at
      FROM translation
      WHERE context = $1 AND deleted_at IS NULL
      ORDER BY translation_key ASC, language_code ASC
    `;
        return await this.databaseService.query<TranslationEntity>(query, [context]);
    }

    async findApproved(): Promise<TranslationEntity[]> {
        const query = `
      SELECT id, translation_key, language_code, translation_value,
             context, is_approved, created_at, updated_at, deleted_at
      FROM translation
      WHERE is_approved = true AND deleted_at IS NULL
      ORDER BY translation_key ASC, language_code ASC
    `;
        return await this.databaseService.query<TranslationEntity>(query);
    }
}
