import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { PaymentStatusRepository } from './repositories/payment-status.repository';
import { PaymentStatusService } from './services/payment-status.service';
import { PaymentStatusController } from './controllers/payment-status.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [PaymentStatusController],
  providers: [PaymentStatusRepository, PaymentStatusService],
  exports: [PaymentStatusService, PaymentStatusRepository],
})
export class PaymentStatusModule {}

