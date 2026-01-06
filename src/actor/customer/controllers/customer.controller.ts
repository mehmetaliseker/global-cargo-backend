import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CustomerService } from '../services/customer.service';
import { CustomerResponseDto } from '../dto/customer.dto';

@Controller('actors/customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async findAll(): Promise<CustomerResponseDto[]> {
    return await this.customerService.findAll();
  }

  @Get('verified')
  async findVerified(): Promise<CustomerResponseDto[]> {
    return await this.customerService.findVerified();
  }

  @Get('country/:countryId')
  async findByCountryId(
    @Param('countryId', ParseIntPipe) countryId: number,
  ): Promise<CustomerResponseDto[]> {
    return await this.customerService.findByCountryId(countryId);
  }

  @Get('country/:countryId/verified')
  async findByCountryIdAndVerified(
    @Param('countryId', ParseIntPipe) countryId: number,
  ): Promise<CustomerResponseDto[]> {
    return await this.customerService.findByCountryIdAndVerified(countryId);
  }

  @Get('actor/:actorId')
  async findByActorId(
    @Param('actorId', ParseIntPipe) actorId: number,
  ): Promise<CustomerResponseDto> {
    return await this.customerService.findByActorId(actorId);
  }

  @Get('uuid/:uuid')
  async findByUuid(@Param('uuid') uuid: string): Promise<CustomerResponseDto> {
    return await this.customerService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CustomerResponseDto> {
    return await this.customerService.findById(id);
  }
}

