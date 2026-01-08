import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { LoyaltyTransactionService } from '../services/customer-interaction.service';
import { CustomerReviewService } from '../services/customer-interaction.service';
import { ReviewRatingService } from '../services/customer-interaction.service';
import { PaymentHistoryService } from '../services/customer-interaction.service';
import {
  LoyaltyTransactionResponseDto,
  CustomerReviewResponseDto,
  ReviewRatingResponseDto,
  PaymentHistoryResponseDto,
} from '../dto/customer-interaction.dto';

@Controller('crm/loyalty-transactions')
export class LoyaltyTransactionController {
  constructor(
    private readonly loyaltyTransactionService: LoyaltyTransactionService,
  ) {}

  @Get()
  async findAll(): Promise<LoyaltyTransactionResponseDto[]> {
    return await this.loyaltyTransactionService.findAll();
  }

  @Get('type/:transactionType')
  async findByTransactionType(
    @Param('transactionType') transactionType: string,
  ): Promise<LoyaltyTransactionResponseDto[]> {
    return await this.loyaltyTransactionService.findByTransactionType(
      transactionType,
    );
  }

  @Get('loyalty-points/:customerLoyaltyPointsId')
  async findByCustomerLoyaltyPointsId(
    @Param('customerLoyaltyPointsId', ParseIntPipe)
    customerLoyaltyPointsId: number,
  ): Promise<LoyaltyTransactionResponseDto[]> {
    return await this.loyaltyTransactionService.findByCustomerLoyaltyPointsId(
      customerLoyaltyPointsId,
    );
  }

  @Get('date-range')
  async findByTransactionDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<LoyaltyTransactionResponseDto[]> {
    return await this.loyaltyTransactionService.findByTransactionDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LoyaltyTransactionResponseDto> {
    return await this.loyaltyTransactionService.findById(id);
  }
}

@Controller('crm/reviews')
export class CustomerReviewController {
  constructor(
    private readonly customerReviewService: CustomerReviewService,
  ) {}

  @Get()
  async findAll(): Promise<CustomerReviewResponseDto[]> {
    return await this.customerReviewService.findAll();
  }

  @Get('published')
  async findPublished(): Promise<CustomerReviewResponseDto[]> {
    return await this.customerReviewService.findPublished();
  }

  @Get('verified')
  async findVerified(): Promise<CustomerReviewResponseDto[]> {
    return await this.customerReviewService.findVerified();
  }

  @Get('rating/:rating')
  async findByRating(
    @Param('rating', ParseIntPipe) rating: number,
  ): Promise<CustomerReviewResponseDto[]> {
    return await this.customerReviewService.findByRating(rating);
  }

  @Get('customer/:customerId')
  async findByCustomerId(
    @Param('customerId', ParseIntPipe) customerId: number,
  ): Promise<CustomerReviewResponseDto[]> {
    return await this.customerReviewService.findByCustomerId(customerId);
  }

  @Get('cargo/:cargoId')
  async findByCargoId(
    @Param('cargoId', ParseIntPipe) cargoId: number,
  ): Promise<CustomerReviewResponseDto[]> {
    return await this.customerReviewService.findByCargoId(cargoId);
  }

  @Get('uuid/:uuid')
  async findByUuid(
    @Param('uuid') uuid: string,
  ): Promise<CustomerReviewResponseDto> {
    return await this.customerReviewService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CustomerReviewResponseDto> {
    return await this.customerReviewService.findById(id);
  }
}

@Controller('crm/review-ratings')
export class ReviewRatingController {
  constructor(
    private readonly reviewRatingService: ReviewRatingService,
  ) {}

  @Get()
  async findAll(): Promise<ReviewRatingResponseDto[]> {
    return await this.reviewRatingService.findAll();
  }

  @Get('review/:customerReviewId')
  async findByCustomerReviewId(
    @Param('customerReviewId', ParseIntPipe) customerReviewId: number,
  ): Promise<ReviewRatingResponseDto[]> {
    return await this.reviewRatingService.findByCustomerReviewId(
      customerReviewId,
    );
  }

  @Get('type/:ratingType')
  async findByRatingType(
    @Param('ratingType') ratingType: string,
  ): Promise<ReviewRatingResponseDto[]> {
    return await this.reviewRatingService.findByRatingType(ratingType);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReviewRatingResponseDto> {
    return await this.reviewRatingService.findById(id);
  }
}

@Controller('crm/payment-history')
export class PaymentHistoryController {
  constructor(
    private readonly paymentHistoryService: PaymentHistoryService,
  ) {}

  @Get()
  async findAll(): Promise<PaymentHistoryResponseDto[]> {
    return await this.paymentHistoryService.findAll();
  }

  @Get('late')
  async findLatePayments(): Promise<PaymentHistoryResponseDto[]> {
    return await this.paymentHistoryService.findLatePayments();
  }

  @Get('customer/:customerId')
  async findByCustomerId(
    @Param('customerId', ParseIntPipe) customerId: number,
  ): Promise<PaymentHistoryResponseDto[]> {
    return await this.paymentHistoryService.findByCustomerId(customerId);
  }

  @Get('payment/:paymentId')
  async findByPaymentId(
    @Param('paymentId', ParseIntPipe) paymentId: number,
  ): Promise<PaymentHistoryResponseDto[]> {
    return await this.paymentHistoryService.findByPaymentId(paymentId);
  }

  @Get('date-range')
  async findByPaymentDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<PaymentHistoryResponseDto[]> {
    return await this.paymentHistoryService.findByPaymentDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PaymentHistoryResponseDto> {
    return await this.paymentHistoryService.findById(id);
  }
}
