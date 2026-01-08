import { Injectable, NotFoundException } from '@nestjs/common';
import { LocalizedContentRepository } from '../repositories/localized-content.repository';
import { LocalizedContentResponseDto } from '../dto/localized-content.dto';
import { LocalizedContentEntity } from '../repositories/localized-content.repository.interface';

@Injectable()
export class LocalizedContentService {
    constructor(
        private readonly localizedContentRepository: LocalizedContentRepository,
    ) { }

    private mapToDto(entity: LocalizedContentEntity): LocalizedContentResponseDto {
        return {
            id: entity.id,
            contentType: entity.content_type,
            contentKey: entity.content_key,
            languageCode: entity.language_code,
            contentValue: entity.content_value,
            isActive: entity.is_active,
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString(),
        };
    }

    async findAll(): Promise<LocalizedContentResponseDto[]> {
        const entities = await this.localizedContentRepository.findAll();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findById(id: number): Promise<LocalizedContentResponseDto> {
        const entity = await this.localizedContentRepository.findById(id);
        if (!entity) {
            throw new NotFoundException(`Localized content with id ${id} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByContentType(contentType: string): Promise<LocalizedContentResponseDto[]> {
        const entities = await this.localizedContentRepository.findByContentType(contentType);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findByContentTypeAndKey(contentType: string, contentKey: string): Promise<LocalizedContentResponseDto[]> {
        const entities = await this.localizedContentRepository.findByContentTypeAndKey(contentType, contentKey);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findByContentTypeKeyAndLanguage(contentType: string, contentKey: string, languageCode: string): Promise<LocalizedContentResponseDto | null> {
        const entity = await this.localizedContentRepository.findByContentTypeKeyAndLanguage(contentType, contentKey, languageCode);
        if (!entity) {
            return null;
        }
        return this.mapToDto(entity);
    }

    async findByLanguage(languageCode: string): Promise<LocalizedContentResponseDto[]> {
        const entities = await this.localizedContentRepository.findByLanguage(languageCode);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findActive(): Promise<LocalizedContentResponseDto[]> {
        const entities = await this.localizedContentRepository.findActive();
        return entities.map((entity) => this.mapToDto(entity));
    }
}
