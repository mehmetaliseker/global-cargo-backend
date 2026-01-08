import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { LocaleSettingRepository } from './repositories/locale-setting.repository';
import { LocaleSettingService } from './services/locale-setting.service';
import { LocaleSettingController } from './controllers/locale-setting.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [LocaleSettingController],
    providers: [LocaleSettingRepository, LocaleSettingService],
    exports: [LocaleSettingService, LocaleSettingRepository],
})
export class LocaleSettingModule { }
