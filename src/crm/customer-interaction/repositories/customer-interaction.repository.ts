import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  LoyaltyTransactionEntity,
  ILoyaltyTransactionRepository,
  CustomerReviewEntity,
  ICustomerReviewRepository,
  ReviewRatingEntity,
  IReviewRatingRepository,
  PaymentHistoryEntity,
  IPaymentHistoryRepository,
} from './customer-interaction.repository.interface';

@Injectable()
export class LoyaltyTransactionRepository
  implements ILoyaltyTransactionRepository
{
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<LoyaltyTransactionEntity[]> {
    const query = `
      SELECT id, customer_loyalty_points_id, transaction_type, points_amount,
             description, related_entity_type, related_entity_id, transaction_date,
             expiry_date, created_at
      FROM loyalty_transaction
      ORDER BY transaction_date DESC
    `;
    return await this.databaseService.query<LoyaltyTransactionEntity>(query);
  }

  async findById(id: number): Promise<LoyaltyTransactionEntity | null> {
    const query = `
      SELECT id, customer_loyalty_points_id, transaction_type, points_amount,
             description, related_entity_type, related_entity_id, transaction_date,
             expiry_date, created_at
      FROM loyalty_transaction
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<LoyaltyTransactionEntity>(
      query,
      [id],
    );
  }

  async findByCustomerLoyaltyPointsId(
    customerLoyaltyPointsId: number,
  ): Promise<LoyaltyTransactionEntity[]> {
    const query = `
      SELECT id, customer_loyalty_points_id, transaction_type, points_amount,
             description, related_entity_type, related_entity_id, transaction_date,
             expiry_date, created_at
      FROM loyalty_transaction
      WHERE customer_loyalty_points_id = $1
      ORDER BY transaction_date DESC
    `;
    return await this.databaseService.query<LoyaltyTransactionEntity>(query, [
      customerLoyaltyPointsId,
    ]);
  }

  async findByTransactionType(
    transactionType: string,
  ): Promise<LoyaltyTransactionEntity[]> {
    const query = `
      SELECT id, customer_loyalty_points_id, transaction_type, points_amount,
             description, related_entity_type, related_entity_id, transaction_date,
             expiry_date, created_at
      FROM loyalty_transaction
      WHERE transaction_type = $1
      ORDER BY transaction_date DESC
    `;
    return await this.databaseService.query<LoyaltyTransactionEntity>(query, [
      transactionType,
    ]);
  }

  async findByTransactionDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<LoyaltyTransactionEntity[]> {
    const query = `
      SELECT id, customer_loyalty_points_id, transaction_type, points_amount,
             description, related_entity_type, related_entity_id, transaction_date,
             expiry_date, created_at
      FROM loyalty_transaction
      WHERE transaction_date >= $1 AND transaction_date <= $2
      ORDER BY transaction_date DESC
    `;
    return await this.databaseService.query<LoyaltyTransactionEntity>(query, [
      startDate,
      endDate,
    ]);
  }
}

@Injectable()
export class CustomerReviewRepository implements ICustomerReviewRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<CustomerReviewEntity[]> {
    const query = `
      SELECT id, uuid, customer_id, cargo_id, review_text, overall_rating,
             review_date, is_verified, is_published, helpful_count,
             created_at, updated_at, deleted_at
      FROM customer_review
      WHERE deleted_at IS NULL
      ORDER BY review_date DESC
    `;
    return await this.databaseService.query<CustomerReviewEntity>(query);
  }

  async findById(id: number): Promise<CustomerReviewEntity | null> {
    const query = `
      SELECT id, uuid, customer_id, cargo_id, review_text, overall_rating,
             review_date, is_verified, is_published, helpful_count,
             created_at, updated_at, deleted_at
      FROM customer_review
      WHERE id = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CustomerReviewEntity>(query, [
      id,
    ]);
  }

  async findByUuid(uuid: string): Promise<CustomerReviewEntity | null> {
    const query = `
      SELECT id, uuid, customer_id, cargo_id, review_text, overall_rating,
             review_date, is_verified, is_published, helpful_count,
             created_at, updated_at, deleted_at
      FROM customer_review
      WHERE uuid = $1 AND deleted_at IS NULL
    `;
    return await this.databaseService.queryOne<CustomerReviewEntity>(query, [
      uuid,
    ]);
  }

  async findByCustomerId(customerId: number): Promise<CustomerReviewEntity[]> {
    const query = `
      SELECT id, uuid, customer_id, cargo_id, review_text, overall_rating,
             review_date, is_verified, is_published, helpful_count,
             created_at, updated_at, deleted_at
      FROM customer_review
      WHERE customer_id = $1 AND deleted_at IS NULL
      ORDER BY review_date DESC
    `;
    return await this.databaseService.query<CustomerReviewEntity>(query, [
      customerId,
    ]);
  }

  async findByCargoId(cargoId: number): Promise<CustomerReviewEntity[]> {
    const query = `
      SELECT id, uuid, customer_id, cargo_id, review_text, overall_rating,
             review_date, is_verified, is_published, helpful_count,
             created_at, updated_at, deleted_at
      FROM customer_review
      WHERE cargo_id = $1 AND deleted_at IS NULL
      ORDER BY review_date DESC
    `;
    return await this.databaseService.query<CustomerReviewEntity>(query, [
      cargoId,
    ]);
  }

  async findByRating(rating: number): Promise<CustomerReviewEntity[]> {
    const query = `
      SELECT id, uuid, customer_id, cargo_id, review_text, overall_rating,
             review_date, is_verified, is_published, helpful_count,
             created_at, updated_at, deleted_at
      FROM customer_review
      WHERE overall_rating = $1 AND deleted_at IS NULL
      ORDER BY review_date DESC
    `;
    return await this.databaseService.query<CustomerReviewEntity>(query, [
      rating,
    ]);
  }

  async findPublished(): Promise<CustomerReviewEntity[]> {
    const query = `
      SELECT id, uuid, customer_id, cargo_id, review_text, overall_rating,
             review_date, is_verified, is_published, helpful_count,
             created_at, updated_at, deleted_at
      FROM customer_review
      WHERE is_published = true AND deleted_at IS NULL
      ORDER BY review_date DESC
    `;
    return await this.databaseService.query<CustomerReviewEntity>(query);
  }

  async findVerified(): Promise<CustomerReviewEntity[]> {
    const query = `
      SELECT id, uuid, customer_id, cargo_id, review_text, overall_rating,
             review_date, is_verified, is_published, helpful_count,
             created_at, updated_at, deleted_at
      FROM customer_review
      WHERE is_verified = true AND deleted_at IS NULL
      ORDER BY review_date DESC
    `;
    return await this.databaseService.query<CustomerReviewEntity>(query);
  }
}

@Injectable()
export class ReviewRatingRepository implements IReviewRatingRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<ReviewRatingEntity[]> {
    const query = `
      SELECT id, customer_review_id, rating_type, rating_value, comment, created_at
      FROM review_rating
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<ReviewRatingEntity>(query);
  }

  async findById(id: number): Promise<ReviewRatingEntity | null> {
    const query = `
      SELECT id, customer_review_id, rating_type, rating_value, comment, created_at
      FROM review_rating
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<ReviewRatingEntity>(query, [id]);
  }

  async findByCustomerReviewId(
    customerReviewId: number,
  ): Promise<ReviewRatingEntity[]> {
    const query = `
      SELECT id, customer_review_id, rating_type, rating_value, comment, created_at
      FROM review_rating
      WHERE customer_review_id = $1
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<ReviewRatingEntity>(query, [
      customerReviewId,
    ]);
  }

  async findByRatingType(ratingType: string): Promise<ReviewRatingEntity[]> {
    const query = `
      SELECT id, customer_review_id, rating_type, rating_value, comment, created_at
      FROM review_rating
      WHERE rating_type = $1
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<ReviewRatingEntity>(query, [
      ratingType,
    ]);
  }
}

@Injectable()
export class PaymentHistoryRepository implements IPaymentHistoryRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<PaymentHistoryEntity[]> {
    const query = `
      SELECT id, customer_id, payment_id, payment_date, amount, currency_id,
             payment_method, status, late_payment_flag, days_late, created_at
      FROM payment_history
      ORDER BY payment_date DESC
    `;
    return await this.databaseService.query<PaymentHistoryEntity>(query);
  }

  async findById(id: number): Promise<PaymentHistoryEntity | null> {
    const query = `
      SELECT id, customer_id, payment_id, payment_date, amount, currency_id,
             payment_method, status, late_payment_flag, days_late, created_at
      FROM payment_history
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<PaymentHistoryEntity>(query, [
      id,
    ]);
  }

  async findByCustomerId(customerId: number): Promise<PaymentHistoryEntity[]> {
    const query = `
      SELECT id, customer_id, payment_id, payment_date, amount, currency_id,
             payment_method, status, late_payment_flag, days_late, created_at
      FROM payment_history
      WHERE customer_id = $1
      ORDER BY payment_date DESC
    `;
    return await this.databaseService.query<PaymentHistoryEntity>(query, [
      customerId,
    ]);
  }

  async findByPaymentId(paymentId: number): Promise<PaymentHistoryEntity[]> {
    const query = `
      SELECT id, customer_id, payment_id, payment_date, amount, currency_id,
             payment_method, status, late_payment_flag, days_late, created_at
      FROM payment_history
      WHERE payment_id = $1
      ORDER BY payment_date DESC
    `;
    return await this.databaseService.query<PaymentHistoryEntity>(query, [
      paymentId,
    ]);
  }

  async findByPaymentDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<PaymentHistoryEntity[]> {
    const query = `
      SELECT id, customer_id, payment_id, payment_date, amount, currency_id,
             payment_method, status, late_payment_flag, days_late, created_at
      FROM payment_history
      WHERE payment_date >= $1 AND payment_date <= $2
      ORDER BY payment_date DESC
    `;
    return await this.databaseService.query<PaymentHistoryEntity>(query, [
      startDate,
      endDate,
    ]);
  }

  async findLatePayments(): Promise<PaymentHistoryEntity[]> {
    const query = `
      SELECT id, customer_id, payment_id, payment_date, amount, currency_id,
             payment_method, status, late_payment_flag, days_late, created_at
      FROM payment_history
      WHERE late_payment_flag = true
      ORDER BY days_late DESC, payment_date DESC
    `;
    return await this.databaseService.query<PaymentHistoryEntity>(query);
  }
}
