import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CustomsDocumentTypeService } from '../services/customs-document-type.service';
import {
  CustomsDocumentTypeResponseDto,
  CreateCustomsDocumentTypeDto,
  UpdateCustomsDocumentTypeDto,
} from '../dto/customs-document-type.dto';

@Controller('customs/document-types')
export class CustomsDocumentTypeController {
  constructor(
    private readonly customsDocumentTypeService: CustomsDocumentTypeService,
  ) {}

  @Get()
  async findAll(): Promise<CustomsDocumentTypeResponseDto[]> {
    return await this.customsDocumentTypeService.findAll();
  }

  @Get('active')
  async findActive(): Promise<CustomsDocumentTypeResponseDto[]> {
    return await this.customsDocumentTypeService.findActive();
  }

  @Get('country/:countryId')
  async findByCountryId(
    @Param('countryId', ParseIntPipe) countryId: number,
  ): Promise<CustomsDocumentTypeResponseDto[]> {
    return await this.customsDocumentTypeService.findByCountryId(countryId);
  }

  @Get('country/:countryId/active')
  async findActiveByCountryId(
    @Param('countryId', ParseIntPipe) countryId: number,
  ): Promise<CustomsDocumentTypeResponseDto[]> {
    return await this.customsDocumentTypeService.findActiveByCountryId(
      countryId,
    );
  }

  @Get('code/:code')
  async findByCode(
    @Param('code') code: string,
  ): Promise<CustomsDocumentTypeResponseDto> {
    return await this.customsDocumentTypeService.findByCode(code);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CustomsDocumentTypeResponseDto> {
    return await this.customsDocumentTypeService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: CreateCustomsDocumentTypeDto,
  ): Promise<CustomsDocumentTypeResponseDto> {
    return await this.customsDocumentTypeService.create(createDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCustomsDocumentTypeDto,
  ): Promise<CustomsDocumentTypeResponseDto> {
    return await this.customsDocumentTypeService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.customsDocumentTypeService.delete(id);
  }
}

