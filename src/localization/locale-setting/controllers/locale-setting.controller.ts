import { Controller, Get, Param } from '@nestjs/common';
import { LocaleSettingService } from '../services/locale-setting.service';
import { LocaleSettingResponseDto } from '../dto/locale-setting.dto';

@Controller('localization/locale-settings')
export class LocaleSettingController {
    constructor(
        private readonly localeSettingService: LocaleSettingService,
    ) { }

    @Get()
    async findAll(): Promise<LocaleSettingResponseDto[]> {
        return await this.localeSettingService.findAll();
    }

    @Get('active')
    async findActive(): Promise<LocaleSettingResponseDto[]> {
        return await this.localeSettingService.findActive();
    }

    @Get('locale-code/:localeCode')
    async findByLocaleCode(
        @Param('localeCode') localeCode: string,
    ): Promise<LocaleSettingResponseDto | null> {
        return await this.localeSettingService.findByLocaleCode(localeCode);
    }

    @Get('country/:countryId')
    async findByCountryId(
        @Param('countryId') countryId: string,
    ): Promise<LocaleSettingResponseDto[]> {
        return await this.localeSettingService.findByCountryId(parseInt(countryId, 10));
    }

    @Get(':id')
    async findById(
        @Param('id') id: string,
    ): Promise<LocaleSettingResponseDto> {
        return await this.localeSettingService.findById(parseInt(id, 10));
    }
}
