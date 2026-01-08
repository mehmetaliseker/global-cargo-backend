import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CargoBarcodeService } from '../services/barcode.service';
import { CargoQrCodeService } from '../services/barcode.service';
import {
  CargoBarcodeResponseDto,
  CargoQrCodeResponseDto,
} from '../dto/barcode.dto';

@Controller('barcode/cargo-barcodes')
export class CargoBarcodeController {
  constructor(
    private readonly cargoBarcodeService: CargoBarcodeService,
  ) {}

  @Get()
  async findAll(): Promise<CargoBarcodeResponseDto[]> {
    return await this.cargoBarcodeService.findAll();
  }

  @Get('type/:barcodeType')
  async findByBarcodeType(
    @Param('barcodeType') barcodeType: string,
  ): Promise<CargoBarcodeResponseDto[]> {
    return await this.cargoBarcodeService.findByBarcodeType(barcodeType);
  }

  @Get('value/:barcodeValue')
  async findByBarcodeValue(
    @Param('barcodeValue') barcodeValue: string,
  ): Promise<CargoBarcodeResponseDto> {
    return await this.cargoBarcodeService.findByBarcodeValue(barcodeValue);
  }

  @Get('cargo/:cargoId')
  async findByCargoId(
    @Param('cargoId', ParseIntPipe) cargoId: number,
  ): Promise<CargoBarcodeResponseDto> {
    return await this.cargoBarcodeService.findByCargoId(cargoId);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CargoBarcodeResponseDto> {
    return await this.cargoBarcodeService.findById(id);
  }
}

@Controller('barcode/cargo-qr-codes')
export class CargoQrCodeController {
  constructor(
    private readonly cargoQrCodeService: CargoQrCodeService,
  ) {}

  @Get()
  async findAll(): Promise<CargoQrCodeResponseDto[]> {
    return await this.cargoQrCodeService.findAll();
  }

  @Get('value/:qrCodeValue')
  async findByQrCodeValue(
    @Param('qrCodeValue') qrCodeValue: string,
  ): Promise<CargoQrCodeResponseDto> {
    return await this.cargoQrCodeService.findByQrCodeValue(qrCodeValue);
  }

  @Get('cargo/:cargoId')
  async findByCargoId(
    @Param('cargoId', ParseIntPipe) cargoId: number,
  ): Promise<CargoQrCodeResponseDto> {
    return await this.cargoQrCodeService.findByCargoId(cargoId);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CargoQrCodeResponseDto> {
    return await this.cargoQrCodeService.findById(id);
  }
}
