import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CustomerRepository } from './repositories/customer.repository';
import { CustomerService } from './services/customer.service';
import { CustomerController } from './controllers/customer.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CustomerController],
  providers: [CustomerRepository, CustomerService],
  exports: [CustomerService, CustomerRepository],
})
export class CustomerModule {}

