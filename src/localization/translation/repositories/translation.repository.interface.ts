export interface TranslationEntity {
    id: number;
    translation_key: string;
    language_code: string;
    translation_value: string;
    context?: string;
    is_approved: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}

export interface ITranslationRepository {
    findAll(): Promise<TranslationEntity[]>;
    findById(id: number): Promise<TranslationEntity | null>;
    findByKey(translationKey: string): Promise<TranslationEntity[]>;
    findByKeyAndLanguage(translationKey: string, languageCode: string): Promise<TranslationEntity | null>;
    findByLanguage(languageCode: string): Promise<TranslationEntity[]>;
    findByContext(context: string): Promise<TranslationEntity[]>;
    findApproved(): Promise<TranslationEntity[]>;
}
