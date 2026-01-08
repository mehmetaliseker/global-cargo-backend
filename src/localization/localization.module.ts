import { Module } from '@nestjs/common';
import { TranslationModule } from './translation/translation.module';
import { LocalizedContentModule } from './localized-content/localized-content.module';
import { LocaleSettingModule } from './locale-setting/locale-setting.module';
import { RegionalConfigModule } from './regional-config/regional-config.module';
import { LegalDocumentModule } from './legal-document/legal-document.module';
import { TermsConditionsVersionModule } from './terms-conditions-version/terms-conditions-version.module';

@Module({
    imports: [
        TranslationModule,
        LocalizedContentModule,
        LocaleSettingModule,
        RegionalConfigModule,
        LegalDocumentModule,
        TermsConditionsVersionModule,
    ],
    exports: [
        TranslationModule,
        LocalizedContentModule,
        LocaleSettingModule,
        RegionalConfigModule,
        LegalDocumentModule,
        TermsConditionsVersionModule,
    ],
})
export class LocalizationModule { }
