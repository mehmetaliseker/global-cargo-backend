import { Injectable, NotFoundException } from '@nestjs/common';
import { LegalDocumentRepository } from '../repositories/legal-document.repository';
import { LegalDocumentResponseDto } from '../dto/legal-document.dto';
import { LegalDocumentEntity } from '../repositories/legal-document.repository.interface';

@Injectable()
export class LegalDocumentService {
    constructor(
        private readonly legalDocumentRepository: LegalDocumentRepository,
    ) { }

    private mapToDto(entity: LegalDocumentEntity): LegalDocumentResponseDto {
        return {
            id: entity.id,
            uuid: entity.uuid,
            documentType: entity.document_type,
            documentName: entity.document_name,
            languageCode: entity.language_code,
            content: entity.content,
            version: entity.version,
            effectiveDate: entity.effective_date.toISOString().split('T')[0],
            isActive: entity.is_active,
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString(),
        };
    }

    async findAll(): Promise<LegalDocumentResponseDto[]> {
        const entities = await this.legalDocumentRepository.findAll();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findById(id: number): Promise<LegalDocumentResponseDto> {
        const entity = await this.legalDocumentRepository.findById(id);
        if (!entity) {
            throw new NotFoundException(`Legal document with id ${id} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByUuid(uuid: string): Promise<LegalDocumentResponseDto> {
        const entity = await this.legalDocumentRepository.findByUuid(uuid);
        if (!entity) {
            throw new NotFoundException(`Legal document with uuid ${uuid} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByDocumentType(documentType: string): Promise<LegalDocumentResponseDto[]> {
        const entities = await this.legalDocumentRepository.findByDocumentType(documentType);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findByDocumentTypeAndLanguage(documentType: string, languageCode: string): Promise<LegalDocumentResponseDto[]> {
        const entities = await this.legalDocumentRepository.findByDocumentTypeAndLanguage(documentType, languageCode);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findByDocumentTypeLanguageAndVersion(documentType: string, languageCode: string, version: string): Promise<LegalDocumentResponseDto | null> {
        const entity = await this.legalDocumentRepository.findByDocumentTypeLanguageAndVersion(documentType, languageCode, version);
        if (!entity) {
            return null;
        }
        return this.mapToDto(entity);
    }

    async findByLanguage(languageCode: string): Promise<LegalDocumentResponseDto[]> {
        const entities = await this.legalDocumentRepository.findByLanguage(languageCode);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findActive(): Promise<LegalDocumentResponseDto[]> {
        const entities = await this.legalDocumentRepository.findActive();
        return entities.map((entity) => this.mapToDto(entity));
    }
}
