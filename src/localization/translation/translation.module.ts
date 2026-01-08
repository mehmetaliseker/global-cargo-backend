import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { TranslationRepository } from './repositories/translation.repository';
import { TranslationService } from './services/translation.service';
import { TranslationController } from './controllers/translation.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [TranslationController],
    providers: [TranslationRepository, TranslationService],
    exports: [TranslationService, TranslationRepository],
})
export class TranslationModule { }
