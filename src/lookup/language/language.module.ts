import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { LanguageRepository } from './repositories/language.repository';
import { LanguageService } from './services/language.service';
import { LanguageController } from './controllers/language.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [LanguageController],
  providers: [LanguageRepository, LanguageService],
  exports: [LanguageService, LanguageRepository],
})
export class LanguageModule {}

