import { Module } from '@nestjs/common';
import { CustomerSupportRequestModule } from './customer-support-request/customer-support-request.module';
import { CustomerSupportResponseModule } from './customer-support-response/customer-support-response.module';

@Module({
  imports: [
    CustomerSupportRequestModule,
    CustomerSupportResponseModule,
  ],
  exports: [
    CustomerSupportRequestModule,
    CustomerSupportResponseModule,
  ],
})
export class SupportModule {}

