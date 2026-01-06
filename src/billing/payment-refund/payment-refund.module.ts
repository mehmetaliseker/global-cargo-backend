import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { PaymentRefundRepository } from './repositories/payment-refund.repository';
import { PaymentRefundService } from './services/payment-refund.service';
import { PaymentRefundController } from './controllers/payment-refund.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [PaymentRefundController],
  providers: [PaymentRefundRepository, PaymentRefundService],
  exports: [PaymentRefundService, PaymentRefundRepository],
})
export class PaymentRefundModule {}

