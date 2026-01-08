import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
    TermsConditionsVersionEntity,
    ITermsConditionsVersionRepository,
} from './terms-conditions-version.repository.interface';

@Injectable()
export class TermsConditionsVersionRepository implements ITermsConditionsVersionRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findAll(): Promise<TermsConditionsVersionEntity[]> {
        const query = `
      SELECT id, version_number, language_code, content, effective_date,
             requires_acceptance, is_active, created_at, updated_at, deleted_at
      FROM terms_conditions_version
      WHERE deleted_at IS NULL
      ORDER BY language_code ASC, version_number DESC
    `;
        return await this.databaseService.query<TermsConditionsVersionEntity>(query);
    }

    async findById(id: number): Promise<TermsConditionsVersionEntity | null> {
        const query = `
      SELECT id, version_number, language_code, content, effective_date,
             requires_acceptance, is_active, created_at, updated_at, deleted_at
      FROM terms_conditions_version
      WHERE id = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<TermsConditionsVersionEntity>(query, [id]);
    }

    async findByVersionNumber(versionNumber: string): Promise<TermsConditionsVersionEntity[]> {
        const query = `
      SELECT id, version_number, language_code, content, effective_date,
             requires_acceptance, is_active, created_at, updated_at, deleted_at
      FROM terms_conditions_version
      WHERE version_number = $1 AND deleted_at IS NULL
      ORDER BY language_code ASC
    `;
        return await this.databaseService.query<TermsConditionsVersionEntity>(query, [versionNumber]);
    }

    async findByVersionNumberAndLanguage(versionNumber: string, languageCode: string): Promise<TermsConditionsVersionEntity | null> {
        const query = `
      SELECT id, version_number, language_code, content, effective_date,
             requires_acceptance, is_active, created_at, updated_at, deleted_at
      FROM terms_conditions_version
      WHERE version_number = $1 AND language_code = $2 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<TermsConditionsVersionEntity>(query, [versionNumber, languageCode]);
    }

    async findByLanguage(languageCode: string): Promise<TermsConditionsVersionEntity[]> {
        const query = `
      SELECT id, version_number, language_code, content, effective_date,
             requires_acceptance, is_active, created_at, updated_at, deleted_at
      FROM terms_conditions_version
      WHERE language_code = $1 AND deleted_at IS NULL
      ORDER BY version_number DESC
    `;
        return await this.databaseService.query<TermsConditionsVersionEntity>(query, [languageCode]);
    }

    async findActive(): Promise<TermsConditionsVersionEntity[]> {
        const query = `
      SELECT id, version_number, language_code, content, effective_date,
             requires_acceptance, is_active, created_at, updated_at, deleted_at
      FROM terms_conditions_version
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY language_code ASC, version_number DESC
    `;
        return await this.databaseService.query<TermsConditionsVersionEntity>(query);
    }

    async findLatestByLanguage(languageCode: string): Promise<TermsConditionsVersionEntity | null> {
        const query = `
      SELECT id, version_number, language_code, content, effective_date,
             requires_acceptance, is_active, created_at, updated_at, deleted_at
      FROM terms_conditions_version
      WHERE language_code = $1 AND is_active = true AND deleted_at IS NULL
      ORDER BY version_number DESC, effective_date DESC
      LIMIT 1
    `;
        return await this.databaseService.queryOne<TermsConditionsVersionEntity>(query, [languageCode]);
    }
}
