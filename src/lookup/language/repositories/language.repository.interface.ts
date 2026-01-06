export interface LanguageEntity {
  language_code: string;
  language_name: string;
  native_name?: string;
  is_active: boolean;
  is_default: boolean;
  created_at: Date;
  deleted_at?: Date;
}

export interface ILanguageRepository {
  findAll(): Promise<LanguageEntity[]>;
  findByCode(languageCode: string): Promise<LanguageEntity | null>;
  findActive(): Promise<LanguageEntity[]>;
  findDefault(): Promise<LanguageEntity | null>;
}

