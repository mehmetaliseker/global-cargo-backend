import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CurrencyRepository } from './repositories/currency.repository';
import { CurrencyService } from './services/currency.service';
import { CurrencyController } from './controllers/currency.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CurrencyController],
  providers: [CurrencyRepository, CurrencyService],
  exports: [CurrencyService, CurrencyRepository],
})
export class CurrencyModule {}

