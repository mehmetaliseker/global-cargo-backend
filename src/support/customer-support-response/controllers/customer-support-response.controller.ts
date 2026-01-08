import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CustomerSupportResponseService } from '../services/customer-support-response.service';
import {
  CustomerSupportResponseResponseDto,
  CreateCustomerSupportResponseDto,
} from '../dto/customer-support-response.dto';

@Controller('support/customer-support-responses')
export class CustomerSupportResponseController {
  constructor(
    private readonly customerSupportResponseService: CustomerSupportResponseService,
  ) {}

  @Get()
  async findAll(): Promise<CustomerSupportResponseResponseDto[]> {
    return await this.customerSupportResponseService.findAll();
  }

  @Get('request/:supportRequestId')
  async findBySupportRequestId(
    @Param('supportRequestId', ParseIntPipe) supportRequestId: number,
  ): Promise<CustomerSupportResponseResponseDto[]> {
    return await this.customerSupportResponseService.findBySupportRequestId(
      supportRequestId,
    );
  }

  @Get('request/:supportRequestId/resolutions')
  async findResolutions(
    @Param('supportRequestId', ParseIntPipe) supportRequestId: number,
  ): Promise<CustomerSupportResponseResponseDto[]> {
    return await this.customerSupportResponseService.findResolutions(
      supportRequestId,
    );
  }

  @Get('employee/:employeeId')
  async findByEmployeeId(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ): Promise<CustomerSupportResponseResponseDto[]> {
    return await this.customerSupportResponseService.findByEmployeeId(
      employeeId,
    );
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CustomerSupportResponseResponseDto> {
    return await this.customerSupportResponseService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: CreateCustomerSupportResponseDto,
  ): Promise<CustomerSupportResponseResponseDto> {
    return await this.customerSupportResponseService.create(createDto);
  }
}

