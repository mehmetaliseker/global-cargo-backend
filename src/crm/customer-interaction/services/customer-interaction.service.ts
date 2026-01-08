import { Injectable, NotFoundException } from '@nestjs/common';
import { LoyaltyTransactionRepository } from '../repositories/customer-interaction.repository';
import { CustomerReviewRepository } from '../repositories/customer-interaction.repository';
import { ReviewRatingRepository } from '../repositories/customer-interaction.repository';
import { PaymentHistoryRepository } from '../repositories/customer-interaction.repository';
import {
  LoyaltyTransactionResponseDto,
  CustomerReviewResponseDto,
  ReviewRatingResponseDto,
  PaymentHistoryResponseDto,
} from '../dto/customer-interaction.dto';
import {
  LoyaltyTransactionEntity,
  CustomerReviewEntity,
  ReviewRatingEntity,
  PaymentHistoryEntity,
} from '../repositories/customer-interaction.repository.interface';

@Injectable()
export class LoyaltyTransactionService {
  constructor(
    private readonly loyaltyTransactionRepository: LoyaltyTransactionRepository,
  ) {}

  private mapToDto(
    entity: LoyaltyTransactionEntity,
  ): LoyaltyTransactionResponseDto {
    return {
      id: entity.id,
      customerLoyaltyPointsId: entity.customer_loyalty_points_id,
      transactionType: entity.transaction_type,
      pointsAmount: parseFloat(entity.points_amount.toString()),
      description: entity.description ?? undefined,
      relatedEntityType: entity.related_entity_type ?? undefined,
      relatedEntityId: entity.related_entity_id ?? undefined,
      transactionDate: entity.transaction_date.toISOString(),
      expiryDate: entity.expiry_date?.toISOString(),
      createdAt: entity.created_at.toISOString(),
    };
  }

  async findAll(): Promise<LoyaltyTransactionResponseDto[]> {
    const entities = await this.loyaltyTransactionRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<LoyaltyTransactionResponseDto> {
    const entity = await this.loyaltyTransactionRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Loyalty transaction with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByCustomerLoyaltyPointsId(
    customerLoyaltyPointsId: number,
  ): Promise<LoyaltyTransactionResponseDto[]> {
    const entities =
      await this.loyaltyTransactionRepository.findByCustomerLoyaltyPointsId(
        customerLoyaltyPointsId,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByTransactionType(
    transactionType: string,
  ): Promise<LoyaltyTransactionResponseDto[]> {
    const entities =
      await this.loyaltyTransactionRepository.findByTransactionType(
        transactionType,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByTransactionDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<LoyaltyTransactionResponseDto[]> {
    const entities =
      await this.loyaltyTransactionRepository.findByTransactionDateRange(
        startDate,
        endDate,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }
}

@Injectable()
export class CustomerReviewService {
  constructor(
    private readonly customerReviewRepository: CustomerReviewRepository,
  ) {}

  private mapToDto(entity: CustomerReviewEntity): CustomerReviewResponseDto {
    return {
      id: entity.id,
      uuid: entity.uuid,
      customerId: entity.customer_id,
      cargoId: entity.cargo_id ?? undefined,
      reviewText: entity.review_text ?? undefined,
      overallRating: entity.overall_rating,
      reviewDate: entity.review_date.toISOString(),
      isVerified: entity.is_verified,
      isPublished: entity.is_published,
      helpfulCount: entity.helpful_count,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<CustomerReviewResponseDto[]> {
    const entities = await this.customerReviewRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<CustomerReviewResponseDto> {
    const entity = await this.customerReviewRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Customer review with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<CustomerReviewResponseDto> {
    const entity = await this.customerReviewRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(
        `Customer review with uuid ${uuid} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByCustomerId(
    customerId: number,
  ): Promise<CustomerReviewResponseDto[]> {
    const entities = await this.customerReviewRepository.findByCustomerId(
      customerId,
    );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCargoId(cargoId: number): Promise<CustomerReviewResponseDto[]> {
    const entities = await this.customerReviewRepository.findByCargoId(
      cargoId,
    );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByRating(rating: number): Promise<CustomerReviewResponseDto[]> {
    const entities = await this.customerReviewRepository.findByRating(rating);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findPublished(): Promise<CustomerReviewResponseDto[]> {
    const entities = await this.customerReviewRepository.findPublished();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findVerified(): Promise<CustomerReviewResponseDto[]> {
    const entities = await this.customerReviewRepository.findVerified();
    return entities.map((entity) => this.mapToDto(entity));
  }
}

@Injectable()
export class ReviewRatingService {
  constructor(
    private readonly reviewRatingRepository: ReviewRatingRepository,
  ) {}

  private mapToDto(entity: ReviewRatingEntity): ReviewRatingResponseDto {
    return {
      id: entity.id,
      customerReviewId: entity.customer_review_id,
      ratingType: entity.rating_type,
      ratingValue: entity.rating_value,
      comment: entity.comment ?? undefined,
      createdAt: entity.created_at.toISOString(),
    };
  }

  async findAll(): Promise<ReviewRatingResponseDto[]> {
    const entities = await this.reviewRatingRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<ReviewRatingResponseDto> {
    const entity = await this.reviewRatingRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Review rating with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByCustomerReviewId(
    customerReviewId: number,
  ): Promise<ReviewRatingResponseDto[]> {
    const entities =
      await this.reviewRatingRepository.findByCustomerReviewId(
        customerReviewId,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByRatingType(
    ratingType: string,
  ): Promise<ReviewRatingResponseDto[]> {
    const entities =
      await this.reviewRatingRepository.findByRatingType(ratingType);
    return entities.map((entity) => this.mapToDto(entity));
  }
}

@Injectable()
export class PaymentHistoryService {
  constructor(
    private readonly paymentHistoryRepository: PaymentHistoryRepository,
  ) {}

  private mapToDto(entity: PaymentHistoryEntity): PaymentHistoryResponseDto {
    return {
      id: entity.id,
      customerId: entity.customer_id,
      paymentId: entity.payment_id ?? undefined,
      paymentDate: entity.payment_date.toISOString(),
      amount: parseFloat(entity.amount.toString()),
      currencyId: entity.currency_id,
      paymentMethod: entity.payment_method ?? undefined,
      status: entity.status ?? undefined,
      latePaymentFlag: entity.late_payment_flag,
      daysLate: entity.days_late,
      createdAt: entity.created_at.toISOString(),
    };
  }

  async findAll(): Promise<PaymentHistoryResponseDto[]> {
    const entities = await this.paymentHistoryRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<PaymentHistoryResponseDto> {
    const entity = await this.paymentHistoryRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Payment history with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByCustomerId(
    customerId: number,
  ): Promise<PaymentHistoryResponseDto[]> {
    const entities = await this.paymentHistoryRepository.findByCustomerId(
      customerId,
    );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByPaymentId(
    paymentId: number,
  ): Promise<PaymentHistoryResponseDto[]> {
    const entities = await this.paymentHistoryRepository.findByPaymentId(
      paymentId,
    );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByPaymentDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<PaymentHistoryResponseDto[]> {
    const entities =
      await this.paymentHistoryRepository.findByPaymentDateRange(
        startDate,
        endDate,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findLatePayments(): Promise<PaymentHistoryResponseDto[]> {
    const entities = await this.paymentHistoryRepository.findLatePayments();
    return entities.map((entity) => this.mapToDto(entity));
  }
}
