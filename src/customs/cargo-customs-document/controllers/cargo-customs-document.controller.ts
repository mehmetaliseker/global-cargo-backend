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
  Query,
} from '@nestjs/common';
import { CargoCustomsDocumentService } from '../services/cargo-customs-document.service';
import {
  CargoCustomsDocumentResponseDto,
  CreateCargoCustomsDocumentDto,
  UpdateCargoCustomsDocumentDto,
  VerifyCargoCustomsDocumentDto,
} from '../dto/cargo-customs-document.dto';

@Controller('customs/cargo-documents')
export class CargoCustomsDocumentController {
  constructor(
    private readonly cargoCustomsDocumentService: CargoCustomsDocumentService,
  ) {}

  @Get()
  async findAll(): Promise<CargoCustomsDocumentResponseDto[]> {
    return await this.cargoCustomsDocumentService.findAll();
  }

  @Get('cargo/:cargoId')
  async findByCargoId(
    @Param('cargoId', ParseIntPipe) cargoId: number,
  ): Promise<CargoCustomsDocumentResponseDto[]> {
    return await this.cargoCustomsDocumentService.findByCargoId(cargoId);
  }

  @Get('cargo/:cargoId/document-type/:documentTypeId')
  async findByCargoIdAndDocumentTypeId(
    @Param('cargoId', ParseIntPipe) cargoId: number,
    @Param('documentTypeId', ParseIntPipe) documentTypeId: number,
  ): Promise<CargoCustomsDocumentResponseDto | null> {
    return await this.cargoCustomsDocumentService.findByCargoIdAndDocumentTypeId(
      cargoId,
      documentTypeId,
    );
  }

  @Get('document-type/:documentTypeId')
  async findByDocumentTypeId(
    @Param('documentTypeId', ParseIntPipe) documentTypeId: number,
  ): Promise<CargoCustomsDocumentResponseDto[]> {
    return await this.cargoCustomsDocumentService.findByDocumentTypeId(
      documentTypeId,
    );
  }

  @Get('verified')
  async findByVerified(
    @Query('verified') verified: string,
  ): Promise<CargoCustomsDocumentResponseDto[]> {
    const isVerified = verified === 'true';
    return await this.cargoCustomsDocumentService.findByVerified(isVerified);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CargoCustomsDocumentResponseDto> {
    return await this.cargoCustomsDocumentService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: CreateCargoCustomsDocumentDto,
  ): Promise<CargoCustomsDocumentResponseDto> {
    return await this.cargoCustomsDocumentService.create(createDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCargoCustomsDocumentDto,
  ): Promise<CargoCustomsDocumentResponseDto> {
    return await this.cargoCustomsDocumentService.update(id, updateDto);
  }

  @Put(':id/verify')
  async verify(
    @Param('id', ParseIntPipe) id: number,
    @Body() verifyDto: VerifyCargoCustomsDocumentDto,
  ): Promise<CargoCustomsDocumentResponseDto> {
    return await this.cargoCustomsDocumentService.verify(id, verifyDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.cargoCustomsDocumentService.delete(id);
  }
}

