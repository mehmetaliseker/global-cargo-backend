import { Injectable, NotFoundException } from '@nestjs/common';
import { TranslationRepository } from '../repositories/translation.repository';
import { TranslationResponseDto } from '../dto/translation.dto';
import { TranslationEntity } from '../repositories/translation.repository.interface';

@Injectable()
export class TranslationService {
    constructor(
        private readonly translationRepository: TranslationRepository,
    ) { }

    private mapToDto(entity: TranslationEntity): TranslationResponseDto {
        return {
            id: entity.id,
            translationKey: entity.translation_key,
            languageCode: entity.language_code,
            translationValue: entity.translation_value,
            context: entity.context ?? undefined,
            isApproved: entity.is_approved,
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString(),
        };
    }

    async findAll(): Promise<TranslationResponseDto[]> {
        const entities = await this.translationRepository.findAll();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findById(id: number): Promise<TranslationResponseDto> {
        const entity = await this.translationRepository.findById(id);
        if (!entity) {
            throw new NotFoundException(`Translation with id ${id} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByKey(translationKey: string): Promise<TranslationResponseDto[]> {
        const entities = await this.translationRepository.findByKey(translationKey);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findByKeyAndLanguage(translationKey: string, languageCode: string): Promise<TranslationResponseDto | null> {
        const entity = await this.translationRepository.findByKeyAndLanguage(translationKey, languageCode);
        if (!entity) {
            return null;
        }
        return this.mapToDto(entity);
    }

    async findByLanguage(languageCode: string): Promise<TranslationResponseDto[]> {
        const entities = await this.translationRepository.findByLanguage(languageCode);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findByContext(context: string): Promise<TranslationResponseDto[]> {
        const entities = await this.translationRepository.findByContext(context);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findApproved(): Promise<TranslationResponseDto[]> {
        const entities = await this.translationRepository.findApproved();
        return entities.map((entity) => this.mapToDto(entity));
    }
}
