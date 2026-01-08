import { Controller, Get, Param } from '@nestjs/common';
import { LegalDocumentService } from '../services/legal-document.service';
import { LegalDocumentResponseDto } from '../dto/legal-document.dto';

@Controller('localization/legal-documents')
export class LegalDocumentController {
    constructor(
        private readonly legalDocumentService: LegalDocumentService,
    ) { }

    @Get()
    async findAll(): Promise<LegalDocumentResponseDto[]> {
        return await this.legalDocumentService.findAll();
    }

    @Get('active')
    async findActive(): Promise<LegalDocumentResponseDto[]> {
        return await this.legalDocumentService.findActive();
    }

    @Get('document-type/:documentType')
    async findByDocumentType(
        @Param('documentType') documentType: string,
    ): Promise<LegalDocumentResponseDto[]> {
        return await this.legalDocumentService.findByDocumentType(documentType);
    }

    @Get('document-type/:documentType/language/:languageCode')
    async findByDocumentTypeAndLanguage(
        @Param('documentType') documentType: string,
        @Param('languageCode') languageCode: string,
    ): Promise<LegalDocumentResponseDto[]> {
        return await this.legalDocumentService.findByDocumentTypeAndLanguage(documentType, languageCode);
    }

    @Get('document-type/:documentType/language/:languageCode/version/:version')
    async findByDocumentTypeLanguageAndVersion(
        @Param('documentType') documentType: string,
        @Param('languageCode') languageCode: string,
        @Param('version') version: string,
    ): Promise<LegalDocumentResponseDto | null> {
        return await this.legalDocumentService.findByDocumentTypeLanguageAndVersion(documentType, languageCode, version);
    }

    @Get('language/:languageCode')
    async findByLanguage(
        @Param('languageCode') languageCode: string,
    ): Promise<LegalDocumentResponseDto[]> {
        return await this.legalDocumentService.findByLanguage(languageCode);
    }

    @Get('uuid/:uuid')
    async findByUuid(
        @Param('uuid') uuid: string,
    ): Promise<LegalDocumentResponseDto> {
        return await this.legalDocumentService.findByUuid(uuid);
    }

    @Get(':id')
    async findById(
        @Param('id') id: string,
    ): Promise<LegalDocumentResponseDto> {
        return await this.legalDocumentService.findById(parseInt(id, 10));
    }
}
