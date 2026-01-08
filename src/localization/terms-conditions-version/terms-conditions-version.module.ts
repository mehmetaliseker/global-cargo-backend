import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { TermsConditionsVersionRepository } from './repositories/terms-conditions-version.repository';
import { TermsConditionsVersionService } from './services/terms-conditions-version.service';
import { TermsConditionsVersionController } from './controllers/terms-conditions-version.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [TermsConditionsVersionController],
    providers: [TermsConditionsVersionRepository, TermsConditionsVersionService],
    exports: [TermsConditionsVersionService, TermsConditionsVersionRepository],
})
export class TermsConditionsVersionModule { }
