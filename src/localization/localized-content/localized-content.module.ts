import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { LocalizedContentRepository } from './repositories/localized-content.repository';
import { LocalizedContentService } from './services/localized-content.service';
import { LocalizedContentController } from './controllers/localized-content.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [LocalizedContentController],
    providers: [LocalizedContentRepository, LocalizedContentService],
    exports: [LocalizedContentService, LocalizedContentRepository],
})
export class LocalizedContentModule { }
