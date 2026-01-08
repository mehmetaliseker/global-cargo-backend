import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CustomerNoteRepository } from './repositories/customer-note.repository';
import { CustomerNoteService } from './services/customer-note.service';
import { CustomerNoteController } from './controllers/customer-note.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CustomerNoteController],
  providers: [CustomerNoteRepository, CustomerNoteService],
  exports: [CustomerNoteService, CustomerNoteRepository],
})
export class CustomerNoteModule {}
