export interface LegalDocumentEntity {
    id: number;
    uuid: string;
    document_type: string;
    document_name: string;
    language_code: string;
    content: string;
    version: string;
    effective_date: Date;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}

export interface ILegalDocumentRepository {
    findAll(): Promise<LegalDocumentEntity[]>;
    findById(id: number): Promise<LegalDocumentEntity | null>;
    findByUuid(uuid: string): Promise<LegalDocumentEntity | null>;
    findByDocumentType(documentType: string): Promise<LegalDocumentEntity[]>;
    findByDocumentTypeAndLanguage(documentType: string, languageCode: string): Promise<LegalDocumentEntity[]>;
    findByDocumentTypeLanguageAndVersion(documentType: string, languageCode: string, version: string): Promise<LegalDocumentEntity | null>;
    findByLanguage(languageCode: string): Promise<LegalDocumentEntity[]>;
    findActive(): Promise<LegalDocumentEntity[]>;
}
