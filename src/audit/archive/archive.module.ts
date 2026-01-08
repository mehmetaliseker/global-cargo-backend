import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ArchiveRepository } from './repositories/archive.repository';
import { ArchiveService } from './services/archive.service';
import { ArchiveController } from './controllers/archive.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ArchiveController],
  providers: [ArchiveRepository, ArchiveService],
  exports: [ArchiveService, ArchiveRepository],
})
export class ArchiveModule {}
