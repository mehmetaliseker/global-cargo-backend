export interface TermsConditionsVersionEntity {
    id: number;
    version_number: string;
    language_code: string;
    content: string;
    effective_date: Date;
    requires_acceptance: boolean;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}

export interface ITermsConditionsVersionRepository {
    findAll(): Promise<TermsConditionsVersionEntity[]>;
    findById(id: number): Promise<TermsConditionsVersionEntity | null>;
    findByVersionNumber(versionNumber: string): Promise<TermsConditionsVersionEntity[]>;
    findByVersionNumberAndLanguage(versionNumber: string, languageCode: string): Promise<TermsConditionsVersionEntity | null>;
    findByLanguage(languageCode: string): Promise<TermsConditionsVersionEntity[]>;
    findActive(): Promise<TermsConditionsVersionEntity[]>;
    findLatestByLanguage(languageCode: string): Promise<TermsConditionsVersionEntity | null>;
}
