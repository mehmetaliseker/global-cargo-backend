import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CustomerSupportRequestRepository } from './repositories/customer-support-request.repository';
import { CustomerSupportRequestService } from './services/customer-support-request.service';
import { CustomerSupportRequestController } from './controllers/customer-support-request.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CustomerSupportRequestController],
  providers: [
    CustomerSupportRequestRepository,
    CustomerSupportRequestService,
  ],
  exports: [
    CustomerSupportRequestService,
    CustomerSupportRequestRepository,
  ],
})
export class CustomerSupportRequestModule {}

