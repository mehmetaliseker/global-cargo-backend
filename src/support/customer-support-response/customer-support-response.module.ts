import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CustomerSupportRequestModule } from '../customer-support-request/customer-support-request.module';
import { CustomerSupportResponseRepository } from './repositories/customer-support-response.repository';
import { CustomerSupportResponseService } from './services/customer-support-response.service';
import { CustomerSupportResponseController } from './controllers/customer-support-response.controller';

@Module({
  imports: [DatabaseModule, CustomerSupportRequestModule],
  controllers: [CustomerSupportResponseController],
  providers: [
    CustomerSupportResponseRepository,
    CustomerSupportResponseService,
  ],
  exports: [
    CustomerSupportResponseService,
    CustomerSupportResponseRepository,
  ],
})
export class CustomerSupportResponseModule {}

