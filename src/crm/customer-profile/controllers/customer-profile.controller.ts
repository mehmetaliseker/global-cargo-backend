import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { LoyaltyProgramService } from '../services/customer-profile.service';
import { CustomerLoyaltyPointsService } from '../services/customer-profile.service';
import { CustomerCreditLimitService } from '../services/customer-profile.service';
import {
  LoyaltyProgramResponseDto,
  CustomerLoyaltyPointsResponseDto,
  CustomerCreditLimitResponseDto,
} from '../dto/customer-profile.dto';

@Controller('crm/loyalty-programs')
export class LoyaltyProgramController {
  constructor(
    private readonly loyaltyProgramService: LoyaltyProgramService,
  ) {}

  @Get()
  async findAll(): Promise<LoyaltyProgramResponseDto[]> {
    return await this.loyaltyProgramService.findAll();
  }

  @Get('active')
  async findActive(): Promise<LoyaltyProgramResponseDto[]> {
    return await this.loyaltyProgramService.findActive();
  }

  @Get('uuid/:uuid')
  async findByUuid(
    @Param('uuid') uuid: string,
  ): Promise<LoyaltyProgramResponseDto> {
    return await this.loyaltyProgramService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LoyaltyProgramResponseDto> {
    return await this.loyaltyProgramService.findById(id);
  }
}

@Controller('crm/loyalty-points')
export class CustomerLoyaltyPointsController {
  constructor(
    private readonly customerLoyaltyPointsService: CustomerLoyaltyPointsService,
  ) {}

  @Get()
  async findAll(): Promise<CustomerLoyaltyPointsResponseDto[]> {
    return await this.customerLoyaltyPointsService.findAll();
  }

  @Get('customer/:customerId')
  async findByCustomerId(
    @Param('customerId', ParseIntPipe) customerId: number,
  ): Promise<CustomerLoyaltyPointsResponseDto> {
    return await this.customerLoyaltyPointsService.findByCustomerId(
      customerId,
    );
  }

  @Get('program/:loyaltyProgramId')
  async findByLoyaltyProgramId(
    @Param('loyaltyProgramId', ParseIntPipe) loyaltyProgramId: number,
  ): Promise<CustomerLoyaltyPointsResponseDto[]> {
    return await this.customerLoyaltyPointsService.findByLoyaltyProgramId(
      loyaltyProgramId,
    );
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CustomerLoyaltyPointsResponseDto> {
    return await this.customerLoyaltyPointsService.findById(id);
  }
}

@Controller('crm/credit-limits')
export class CustomerCreditLimitController {
  constructor(
    private readonly customerCreditLimitService: CustomerCreditLimitService,
  ) {}

  @Get()
  async findAll(): Promise<CustomerCreditLimitResponseDto[]> {
    return await this.customerCreditLimitService.findAll();
  }

  @Get('customer/:customerId')
  async findByCustomerId(
    @Param('customerId', ParseIntPipe) customerId: number,
  ): Promise<CustomerCreditLimitResponseDto> {
    return await this.customerCreditLimitService.findByCustomerId(customerId);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CustomerCreditLimitResponseDto> {
    return await this.customerCreditLimitService.findById(id);
  }
}
