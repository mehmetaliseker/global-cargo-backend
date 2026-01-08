import { Controller, Get, Param } from '@nestjs/common';
import { TermsConditionsVersionService } from '../services/terms-conditions-version.service';
import { TermsConditionsVersionResponseDto } from '../dto/terms-conditions-version.dto';

@Controller('localization/terms-conditions-versions')
export class TermsConditionsVersionController {
    constructor(
        private readonly termsConditionsVersionService: TermsConditionsVersionService,
    ) { }

    @Get()
    async findAll(): Promise<TermsConditionsVersionResponseDto[]> {
        return await this.termsConditionsVersionService.findAll();
    }

    @Get('active')
    async findActive(): Promise<TermsConditionsVersionResponseDto[]> {
        return await this.termsConditionsVersionService.findActive();
    }

    @Get('version/:versionNumber')
    async findByVersionNumber(
        @Param('versionNumber') versionNumber: string,
    ): Promise<TermsConditionsVersionResponseDto[]> {
        return await this.termsConditionsVersionService.findByVersionNumber(versionNumber);
    }

    @Get('version/:versionNumber/language/:languageCode')
    async findByVersionNumberAndLanguage(
        @Param('versionNumber') versionNumber: string,
        @Param('languageCode') languageCode: string,
    ): Promise<TermsConditionsVersionResponseDto | null> {
        return await this.termsConditionsVersionService.findByVersionNumberAndLanguage(versionNumber, languageCode);
    }

    @Get('language/:languageCode')
    async findByLanguage(
        @Param('languageCode') languageCode: string,
    ): Promise<TermsConditionsVersionResponseDto[]> {
        return await this.termsConditionsVersionService.findByLanguage(languageCode);
    }

    @Get('language/:languageCode/latest')
    async findLatestByLanguage(
        @Param('languageCode') languageCode: string,
    ): Promise<TermsConditionsVersionResponseDto | null> {
        return await this.termsConditionsVersionService.findLatestByLanguage(languageCode);
    }

    @Get(':id')
    async findById(
        @Param('id') id: string,
    ): Promise<TermsConditionsVersionResponseDto> {
        return await this.termsConditionsVersionService.findById(parseInt(id, 10));
    }
}
