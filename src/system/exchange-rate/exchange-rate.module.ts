import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ExchangeRateRepository } from './repositories/exchange-rate.repository';
import { ExchangeRateService } from './services/exchange-rate.service';
import { ExchangeRateController } from './controllers/exchange-rate.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ExchangeRateController],
  providers: [ExchangeRateRepository, ExchangeRateService],
  exports: [ExchangeRateService, ExchangeRateRepository],
})
export class ExchangeRateModule {}
