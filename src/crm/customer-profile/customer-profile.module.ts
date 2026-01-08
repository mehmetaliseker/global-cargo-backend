import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import {
  LoyaltyProgramRepository,
  CustomerLoyaltyPointsRepository,
  CustomerCreditLimitRepository,
} from './repositories/customer-profile.repository';
import {
  LoyaltyProgramService,
  CustomerLoyaltyPointsService,
  CustomerCreditLimitService,
} from './services/customer-profile.service';
import {
  LoyaltyProgramController,
  CustomerLoyaltyPointsController,
  CustomerCreditLimitController,
} from './controllers/customer-profile.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [
    LoyaltyProgramController,
    CustomerLoyaltyPointsController,
    CustomerCreditLimitController,
  ],
  providers: [
    LoyaltyProgramRepository,
    CustomerLoyaltyPointsRepository,
    CustomerCreditLimitRepository,
    LoyaltyProgramService,
    CustomerLoyaltyPointsService,
    CustomerCreditLimitService,
  ],
  exports: [
    LoyaltyProgramService,
    CustomerLoyaltyPointsService,
    CustomerCreditLimitService,
    LoyaltyProgramRepository,
    CustomerLoyaltyPointsRepository,
    CustomerCreditLimitRepository,
  ],
})
export class CustomerProfileModule {}
