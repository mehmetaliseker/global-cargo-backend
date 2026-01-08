import { Controller, Get, Param, Query } from '@nestjs/common';
import { TranslationService } from '../services/translation.service';
import { TranslationResponseDto } from '../dto/translation.dto';

@Controller('localization/translations')
export class TranslationController {
    constructor(
        private readonly translationService: TranslationService,
    ) { }

    @Get()
    async findAll(): Promise<TranslationResponseDto[]> {
        return await this.translationService.findAll();
    }

    @Get('approved')
    async findApproved(): Promise<TranslationResponseDto[]> {
        return await this.translationService.findApproved();
    }

    @Get('key/:translationKey')
    async findByKey(
        @Param('translationKey') translationKey: string,
    ): Promise<TranslationResponseDto[]> {
        return await this.translationService.findByKey(translationKey);
    }

    @Get('key/:translationKey/language/:languageCode')
    async findByKeyAndLanguage(
        @Param('translationKey') translationKey: string,
        @Param('languageCode') languageCode: string,
    ): Promise<TranslationResponseDto | null> {
        return await this.translationService.findByKeyAndLanguage(translationKey, languageCode);
    }

    @Get('language/:languageCode')
    async findByLanguage(
        @Param('languageCode') languageCode: string,
    ): Promise<TranslationResponseDto[]> {
        return await this.translationService.findByLanguage(languageCode);
    }

    @Get('context/:context')
    async findByContext(
        @Param('context') context: string,
    ): Promise<TranslationResponseDto[]> {
        return await this.translationService.findByContext(context);
    }

    @Get(':id')
    async findById(
        @Param('id') id: string,
    ): Promise<TranslationResponseDto> {
        return await this.translationService.findById(parseInt(id, 10));
    }
}
