export interface LocalizedContentEntity {
    id: number;
    content_type: string;
    content_key: string;
    language_code: string;
    content_value: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}

export interface ILocalizedContentRepository {
    findAll(): Promise<LocalizedContentEntity[]>;
    findById(id: number): Promise<LocalizedContentEntity | null>;
    findByContentType(contentType: string): Promise<LocalizedContentEntity[]>;
    findByContentTypeAndKey(contentType: string, contentKey: string): Promise<LocalizedContentEntity[]>;
    findByContentTypeKeyAndLanguage(contentType: string, contentKey: string, languageCode: string): Promise<LocalizedContentEntity | null>;
    findByLanguage(languageCode: string): Promise<LocalizedContentEntity[]>;
    findActive(): Promise<LocalizedContentEntity[]>;
}
