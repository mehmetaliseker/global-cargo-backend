import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { PaymentMethodRepository } from './repositories/payment-method.repository';
import { PaymentMethodService } from './services/payment-method.service';
import { PaymentMethodController } from './controllers/payment-method.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [PaymentMethodController],
  providers: [PaymentMethodRepository, PaymentMethodService],
  exports: [PaymentMethodService, PaymentMethodRepository],
})
export class PaymentMethodModule {}

