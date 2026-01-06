import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { PaymentRepository } from './repositories/payment.repository';
import { PaymentService } from './services/payment.service';
import { PaymentController } from './controllers/payment.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [PaymentController],
  providers: [PaymentRepository, PaymentService],
  exports: [PaymentService, PaymentRepository],
})
export class PaymentModule {}

