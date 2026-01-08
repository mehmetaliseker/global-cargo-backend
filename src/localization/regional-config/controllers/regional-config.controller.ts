import { Controller, Get, Param } from '@nestjs/common';
import { RegionalConfigService } from '../services/regional-config.service';
import { RegionalConfigResponseDto } from '../dto/regional-config.dto';

@Controller('localization/regional-configs')
export class RegionalConfigController {
    constructor(
        private readonly regionalConfigService: RegionalConfigService,
    ) { }

    @Get()
    async findAll(): Promise<RegionalConfigResponseDto[]> {
        return await this.regionalConfigService.findAll();
    }

    @Get('active')
    async findActive(): Promise<RegionalConfigResponseDto[]> {
        return await this.regionalConfigService.findActive();
    }

    @Get('country/:countryId')
    async findByCountryId(
        @Param('countryId') countryId: string,
    ): Promise<RegionalConfigResponseDto[]> {
        return await this.regionalConfigService.findByCountryId(parseInt(countryId, 10));
    }

    @Get('country/:countryId/config-key/:configKey')
    async findByCountryAndConfigKey(
        @Param('countryId') countryId: string,
        @Param('configKey') configKey: string,
    ): Promise<RegionalConfigResponseDto | null> {
        return await this.regionalConfigService.findByCountryAndConfigKey(parseInt(countryId, 10), configKey);
    }

    @Get('region/:regionId')
    async findByRegionId(
        @Param('regionId') regionId: string,
    ): Promise<RegionalConfigResponseDto[]> {
        return await this.regionalConfigService.findByRegionId(parseInt(regionId, 10));
    }

    @Get('region/:regionId/config-key/:configKey')
    async findByRegionAndConfigKey(
        @Param('regionId') regionId: string,
        @Param('configKey') configKey: string,
    ): Promise<RegionalConfigResponseDto | null> {
        return await this.regionalConfigService.findByRegionAndConfigKey(parseInt(regionId, 10), configKey);
    }

    @Get('config-key/:configKey')
    async findByConfigKey(
        @Param('configKey') configKey: string,
    ): Promise<RegionalConfigResponseDto[]> {
        return await this.regionalConfigService.findByConfigKey(configKey);
    }

    @Get(':id')
    async findById(
        @Param('id') id: string,
    ): Promise<RegionalConfigResponseDto> {
        return await this.regionalConfigService.findById(parseInt(id, 10));
    }
}
