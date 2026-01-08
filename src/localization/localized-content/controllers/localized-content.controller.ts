import { Controller, Get, Param } from '@nestjs/common';
import { LocalizedContentService } from '../services/localized-content.service';
import { LocalizedContentResponseDto } from '../dto/localized-content.dto';

@Controller('localization/localized-contents')
export class LocalizedContentController {
    constructor(
        private readonly localizedContentService: LocalizedContentService,
    ) { }

    @Get()
    async findAll(): Promise<LocalizedContentResponseDto[]> {
        return await this.localizedContentService.findAll();
    }

    @Get('active')
    async findActive(): Promise<LocalizedContentResponseDto[]> {
        return await this.localizedContentService.findActive();
    }

    @Get('content-type/:contentType')
    async findByContentType(
        @Param('contentType') contentType: string,
    ): Promise<LocalizedContentResponseDto[]> {
        return await this.localizedContentService.findByContentType(contentType);
    }

    @Get('content-type/:contentType/key/:contentKey')
    async findByContentTypeAndKey(
        @Param('contentType') contentType: string,
        @Param('contentKey') contentKey: string,
    ): Promise<LocalizedContentResponseDto[]> {
        return await this.localizedContentService.findByContentTypeAndKey(contentType, contentKey);
    }

    @Get('content-type/:contentType/key/:contentKey/language/:languageCode')
    async findByContentTypeKeyAndLanguage(
        @Param('contentType') contentType: string,
        @Param('contentKey') contentKey: string,
        @Param('languageCode') languageCode: string,
    ): Promise<LocalizedContentResponseDto | null> {
        return await this.localizedContentService.findByContentTypeKeyAndLanguage(contentType, contentKey, languageCode);
    }

    @Get('language/:languageCode')
    async findByLanguage(
        @Param('languageCode') languageCode: string,
    ): Promise<LocalizedContentResponseDto[]> {
        return await this.localizedContentService.findByLanguage(languageCode);
    }

    @Get(':id')
    async findById(
        @Param('id') id: string,
    ): Promise<LocalizedContentResponseDto> {
        return await this.localizedContentService.findById(parseInt(id, 10));
    }
}
