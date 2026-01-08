import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { LegalDocumentRepository } from './repositories/legal-document.repository';
import { LegalDocumentService } from './services/legal-document.service';
import { LegalDocumentController } from './controllers/legal-document.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [LegalDocumentController],
    providers: [LegalDocumentRepository, LegalDocumentService],
    exports: [LegalDocumentService, LegalDocumentRepository],
})
export class LegalDocumentModule { }
