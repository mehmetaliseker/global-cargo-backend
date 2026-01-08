import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
    LegalDocumentEntity,
    ILegalDocumentRepository,
} from './legal-document.repository.interface';

@Injectable()
export class LegalDocumentRepository implements ILegalDocumentRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findAll(): Promise<LegalDocumentEntity[]> {
        const query = `
      SELECT id, uuid, document_type, document_name, language_code,
             content, version, effective_date, is_active,
             created_at, updated_at, deleted_at
      FROM legal_document
      WHERE deleted_at IS NULL
      ORDER BY document_type ASC, language_code ASC, version DESC
    `;
        return await this.databaseService.query<LegalDocumentEntity>(query);
    }

    async findById(id: number): Promise<LegalDocumentEntity | null> {
        const query = `
      SELECT id, uuid, document_type, document_name, language_code,
             content, version, effective_date, is_active,
             created_at, updated_at, deleted_at
      FROM legal_document
      WHERE id = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<LegalDocumentEntity>(query, [id]);
    }

    async findByUuid(uuid: string): Promise<LegalDocumentEntity | null> {
        const query = `
      SELECT id, uuid, document_type, document_name, language_code,
             content, version, effective_date, is_active,
             created_at, updated_at, deleted_at
      FROM legal_document
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<LegalDocumentEntity>(query, [uuid]);
    }

    async findByDocumentType(documentType: string): Promise<LegalDocumentEntity[]> {
        const query = `
      SELECT id, uuid, document_type, document_name, language_code,
             content, version, effective_date, is_active,
             created_at, updated_at, deleted_at
      FROM legal_document
      WHERE document_type = $1 AND deleted_at IS NULL
      ORDER BY language_code ASC, version DESC
    `;
        return await this.databaseService.query<LegalDocumentEntity>(query, [documentType]);
    }

    async findByDocumentTypeAndLanguage(documentType: string, languageCode: string): Promise<LegalDocumentEntity[]> {
        const query = `
      SELECT id, uuid, document_type, document_name, language_code,
             content, version, effective_date, is_active,
             created_at, updated_at, deleted_at
      FROM legal_document
      WHERE document_type = $1 AND language_code = $2 AND deleted_at IS NULL
      ORDER BY version DESC
    `;
        return await this.databaseService.query<LegalDocumentEntity>(query, [documentType, languageCode]);
    }

    async findByDocumentTypeLanguageAndVersion(documentType: string, languageCode: string, version: string): Promise<LegalDocumentEntity | null> {
        const query = `
      SELECT id, uuid, document_type, document_name, language_code,
             content, version, effective_date, is_active,
             created_at, updated_at, deleted_at
      FROM legal_document
      WHERE document_type = $1 AND language_code = $2 AND version = $3 AND deleted_at IS NULL
    `;
        return await this.databaseService.queryOne<LegalDocumentEntity>(query, [documentType, languageCode, version]);
    }

    async findByLanguage(languageCode: string): Promise<LegalDocumentEntity[]> {
        const query = `
      SELECT id, uuid, document_type, document_name, language_code,
             content, version, effective_date, is_active,
             created_at, updated_at, deleted_at
      FROM legal_document
      WHERE language_code = $1 AND deleted_at IS NULL
      ORDER BY document_type ASC, version DESC
    `;
        return await this.databaseService.query<LegalDocumentEntity>(query, [languageCode]);
    }

    async findActive(): Promise<LegalDocumentEntity[]> {
        const query = `
      SELECT id, uuid, document_type, document_name, language_code,
             content, version, effective_date, is_active,
             created_at, updated_at, deleted_at
      FROM legal_document
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY document_type ASC, language_code ASC, version DESC
    `;
        return await this.databaseService.query<LegalDocumentEntity>(query);
    }
}
