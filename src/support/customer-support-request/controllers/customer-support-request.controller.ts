import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseIntPipe,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CustomerSupportRequestService } from '../services/customer-support-request.service';
import {
  CustomerSupportRequestResponseDto,
  CreateCustomerSupportRequestDto,
  UpdateCustomerSupportRequestDto,
} from '../dto/customer-support-request.dto';

@Controller('support/customer-support-requests')
export class CustomerSupportRequestController {
  constructor(
    private readonly customerSupportRequestService: CustomerSupportRequestService,
  ) {}

  @Get()
  async findAll(
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('customerId') customerId?: string,
    @Query('assignedTo') assignedTo?: string,
  ): Promise<CustomerSupportRequestResponseDto[]> {
    if (status) {
      return await this.customerSupportRequestService.findByStatus(status);
    }
    if (priority) {
      return await this.customerSupportRequestService.findByPriority(priority);
    }
    if (customerId) {
      const customerIdNum = parseInt(customerId, 10);
      if (status) {
        return await this.customerSupportRequestService.findByCustomerIdAndStatus(
          customerIdNum,
          status,
        );
      }
      return await this.customerSupportRequestService.findByCustomerId(
        customerIdNum,
      );
    }
    if (assignedTo) {
      const assignedToNum = parseInt(assignedTo, 10);
      return await this.customerSupportRequestService.findByAssignedTo(
        assignedToNum,
      );
    }
    return await this.customerSupportRequestService.findAll();
  }

  @Get('customer/:customerId')
  async findByCustomerId(
    @Param('customerId', ParseIntPipe) customerId: number,
  ): Promise<CustomerSupportRequestResponseDto[]> {
    return await this.customerSupportRequestService.findByCustomerId(customerId);
  }

  @Get('cargo/:cargoId')
  async findByCargoId(
    @Param('cargoId', ParseIntPipe) cargoId: number,
  ): Promise<CustomerSupportRequestResponseDto[]> {
    return await this.customerSupportRequestService.findByCargoId(cargoId);
  }

  @Get('status/:status')
  async findByStatus(
    @Param('status') status: string,
  ): Promise<CustomerSupportRequestResponseDto[]> {
    return await this.customerSupportRequestService.findByStatus(status);
  }

  @Get('priority/:priority')
  async findByPriority(
    @Param('priority') priority: string,
  ): Promise<CustomerSupportRequestResponseDto[]> {
    return await this.customerSupportRequestService.findByPriority(priority);
  }

  @Get('assigned/:employeeId')
  async findByAssignedTo(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ): Promise<CustomerSupportRequestResponseDto[]> {
    return await this.customerSupportRequestService.findByAssignedTo(employeeId);
  }

  @Get('uuid/:uuid')
  async findByUuid(
    @Param('uuid') uuid: string,
  ): Promise<CustomerSupportRequestResponseDto> {
    return await this.customerSupportRequestService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CustomerSupportRequestResponseDto> {
    return await this.customerSupportRequestService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: CreateCustomerSupportRequestDto,
  ): Promise<CustomerSupportRequestResponseDto> {
    return await this.customerSupportRequestService.create(createDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCustomerSupportRequestDto,
  ): Promise<CustomerSupportRequestResponseDto> {
    return await this.customerSupportRequestService.update(id, updateDto);
  }
}

