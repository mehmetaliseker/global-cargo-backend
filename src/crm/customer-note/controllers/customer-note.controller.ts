import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CustomerNoteService } from '../services/customer-note.service';
import { CustomerNoteResponseDto } from '../dto/customer-note.dto';

@Controller('crm/notes')
export class CustomerNoteController {
  constructor(
    private readonly customerNoteService: CustomerNoteService,
  ) {}

  @Get()
  async findAll(): Promise<CustomerNoteResponseDto[]> {
    return await this.customerNoteService.findAll();
  }

  @Get('public')
  async findPublic(): Promise<CustomerNoteResponseDto[]> {
    return await this.customerNoteService.findPublic();
  }

  @Get('private')
  async findPrivate(): Promise<CustomerNoteResponseDto[]> {
    return await this.customerNoteService.findPrivate();
  }

  @Get('type/:noteType')
  async findByNoteType(
    @Param('noteType') noteType: string,
  ): Promise<CustomerNoteResponseDto[]> {
    return await this.customerNoteService.findByNoteType(noteType);
  }

  @Get('customer/:customerId')
  async findByCustomerId(
    @Param('customerId', ParseIntPipe) customerId: number,
  ): Promise<CustomerNoteResponseDto[]> {
    return await this.customerNoteService.findByCustomerId(customerId);
  }

  @Get('created-by/:createdBy')
  async findByCreatedBy(
    @Param('createdBy', ParseIntPipe) createdBy: number,
  ): Promise<CustomerNoteResponseDto[]> {
    return await this.customerNoteService.findByCreatedBy(createdBy);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CustomerNoteResponseDto> {
    return await this.customerNoteService.findById(id);
  }
}
