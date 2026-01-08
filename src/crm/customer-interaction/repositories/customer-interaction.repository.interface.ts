export interface LoyaltyTransactionEntity {
  id: number;
  customer_loyalty_points_id: number;
  transaction_type: string;
  points_amount: number;
  description?: string;
  related_entity_type?: string;
  related_entity_id?: number;
  transaction_date: Date;
  expiry_date?: Date;
  created_at: Date;
}

export interface CustomerReviewEntity {
  id: number;
  uuid: string;
  customer_id: number;
  cargo_id?: number;
  review_text?: string;
  overall_rating: number;
  review_date: Date;
  is_verified: boolean;
  is_published: boolean;
  helpful_count: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface ReviewRatingEntity {
  id: number;
  customer_review_id: number;
  rating_type: string;
  rating_value: number;
  comment?: string;
  created_at: Date;
}

export interface PaymentHistoryEntity {
  id: number;
  customer_id: number;
  payment_id?: number;
  payment_date: Date;
  amount: number;
  currency_id: number;
  payment_method?: string;
  status?: string;
  late_payment_flag: boolean;
  days_late: number;
  created_at: Date;
}

export interface ILoyaltyTransactionRepository {
  findAll(): Promise<LoyaltyTransactionEntity[]>;
  findById(id: number): Promise<LoyaltyTransactionEntity | null>;
  findByCustomerLoyaltyPointsId(
    customerLoyaltyPointsId: number,
  ): Promise<LoyaltyTransactionEntity[]>;
  findByTransactionType(transactionType: string): Promise<LoyaltyTransactionEntity[]>;
  findByTransactionDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<LoyaltyTransactionEntity[]>;
}

export interface ICustomerReviewRepository {
  findAll(): Promise<CustomerReviewEntity[]>;
  findById(id: number): Promise<CustomerReviewEntity | null>;
  findByUuid(uuid: string): Promise<CustomerReviewEntity | null>;
  findByCustomerId(customerId: number): Promise<CustomerReviewEntity[]>;
  findByCargoId(cargoId: number): Promise<CustomerReviewEntity[]>;
  findByRating(rating: number): Promise<CustomerReviewEntity[]>;
  findPublished(): Promise<CustomerReviewEntity[]>;
  findVerified(): Promise<CustomerReviewEntity[]>;
}

export interface IReviewRatingRepository {
  findAll(): Promise<ReviewRatingEntity[]>;
  findById(id: number): Promise<ReviewRatingEntity | null>;
  findByCustomerReviewId(
    customerReviewId: number,
  ): Promise<ReviewRatingEntity[]>;
  findByRatingType(ratingType: string): Promise<ReviewRatingEntity[]>;
}

export interface IPaymentHistoryRepository {
  findAll(): Promise<PaymentHistoryEntity[]>;
  findById(id: number): Promise<PaymentHistoryEntity | null>;
  findByCustomerId(customerId: number): Promise<PaymentHistoryEntity[]>;
  findByPaymentId(paymentId: number): Promise<PaymentHistoryEntity[]>;
  findByPaymentDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<PaymentHistoryEntity[]>;
  findLatePayments(): Promise<PaymentHistoryEntity[]>;
}
