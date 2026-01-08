import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
    LocalizedContentEntity,
    ILocalizedContentRepository,
} from './localized-content.repository.interface';

@Injectable()
export class LocalizedContentRepository implements ILocalizedContentRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findAll(): Promise<LocalizedContentEntity[]> {
        const query = `
      SELECT id, content_type, content_key, language_code, content_value,
             is_active, created_at, updated_at, deleted_at
      FROM localized_content
      WHERE deleted_at IS NULL
      ORDER BY content_type ASC, content_key ASC, language_code ASC
    `;
        return await this.databaseService.query<LocalizedContentEntity>(query);
    }

    async findById(id: number): Promise<LocalizedContentEntity | null> {
        const query = `
      SELECT id, content_type, content_key, language_code, content_value,
             is_active, created_at, updated_at, deleted_at
      FROM localized_content
      WHERE id = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<LocalizedContentEntity>(query, [id]);
    }

    async findByContentType(contentType: string): Promise<LocalizedContentEntity[]> {
        const query = `
      SELECT id, content_type, content_key, language_code, content_value,
             is_active, created_at, updated_at, deleted_at
      FROM localized_content
      WHERE content_type = $1 AND deleted_at IS NULL
      ORDER BY content_key ASC, language_code ASC
    `;
        return await this.databaseService.query<LocalizedContentEntity>(query, [contentType]);
    }

    async findByContentTypeAndKey(contentType: string, contentKey: string): Promise<LocalizedContentEntity[]> {
        const query = `
      SELECT id, content_type, content_key, language_code, content_value,
             is_active, created_at, updated_at, deleted_at
      FROM localized_content
      WHERE content_type = $1 AND content_key = $2 AND deleted_at IS NULL
      ORDER BY language_code ASC
    `;
        return await this.databaseService.query<LocalizedContentEntity>(query, [contentType, contentKey]);
    }

    async findByContentTypeKeyAndLanguage(contentType: string, contentKey: string, languageCode: string): Promise<LocalizedContentEntity | null> {
        const query = `
      SELECT id, content_type, content_key, language_code, content_value,
             is_active, created_at, updated_at, deleted_at
      FROM localized_content
      WHERE content_type = $1 AND content_key = $2 AND language_code = $3 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<LocalizedContentEntity>(query, [contentType, contentKey, languageCode]);
    }

    async findByLanguage(languageCode: string): Promise<LocalizedContentEntity[]> {
        const query = `
      SELECT id, content_type, content_key, language_code, content_value,
             is_active, created_at, updated_at, deleted_at
      FROM localized_content
      WHERE language_code = $1 AND deleted_at IS NULL
      ORDER BY content_type ASC, content_key ASC
    `;
        return await this.databaseService.query<LocalizedContentEntity>(query, [languageCode]);
    }

    async findActive(): Promise<LocalizedContentEntity[]> {
        const query = `
      SELECT id, content_type, content_key, language_code, content_value,
             is_active, created_at, updated_at, deleted_at
      FROM localized_content
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY content_type ASC, content_key ASC, language_code ASC
    `;
        return await this.databaseService.query<LocalizedContentEntity>(query);
    }
}
