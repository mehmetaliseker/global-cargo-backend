import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { InvoiceRepository } from './repositories/invoice.repository';
import { InvoiceService } from './services/invoice.service';
import { InvoiceController } from './controllers/invoice.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [InvoiceController],
  providers: [InvoiceRepository, InvoiceService],
  exports: [InvoiceService, InvoiceRepository],
})
export class InvoiceModule {}

