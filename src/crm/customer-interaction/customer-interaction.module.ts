import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import {
  LoyaltyTransactionRepository,
  CustomerReviewRepository,
  ReviewRatingRepository,
  PaymentHistoryRepository,
} from './repositories/customer-interaction.repository';
import {
  LoyaltyTransactionService,
  CustomerReviewService,
  ReviewRatingService,
  PaymentHistoryService,
} from './services/customer-interaction.service';
import {
  LoyaltyTransactionController,
  CustomerReviewController,
  ReviewRatingController,
  PaymentHistoryController,
} from './controllers/customer-interaction.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [
    LoyaltyTransactionController,
    CustomerReviewController,
    ReviewRatingController,
    PaymentHistoryController,
  ],
  providers: [
    LoyaltyTransactionRepository,
    CustomerReviewRepository,
    ReviewRatingRepository,
    PaymentHistoryRepository,
    LoyaltyTransactionService,
    CustomerReviewService,
    ReviewRatingService,
    PaymentHistoryService,
  ],
  exports: [
    LoyaltyTransactionService,
    CustomerReviewService,
    ReviewRatingService,
    PaymentHistoryService,
    LoyaltyTransactionRepository,
    CustomerReviewRepository,
    ReviewRatingRepository,
    PaymentHistoryRepository,
  ],
})
export class CustomerInteractionModule {}
