import { Injectable, NotFoundException } from '@nestjs/common';
import { CargoBarcodeRepository } from '../repositories/barcode.repository';
import { CargoQrCodeRepository } from '../repositories/barcode.repository';
import {
  CargoBarcodeResponseDto,
  CargoQrCodeResponseDto,
} from '../dto/barcode.dto';
import {
  CargoBarcodeEntity,
  CargoQrCodeEntity,
} from '../repositories/barcode.repository.interface';

@Injectable()
export class CargoBarcodeService {
  constructor(
    private readonly cargoBarcodeRepository: CargoBarcodeRepository,
  ) {}

  private mapToDto(entity: CargoBarcodeEntity): CargoBarcodeResponseDto {
    return {
      id: entity.id,
      cargoId: entity.cargo_id,
      barcodeType: entity.barcode_type,
      barcodeValue: entity.barcode_value,
      barcodeImageReference: entity.barcode_image_reference ?? undefined,
      generatedAt: entity.generated_at.toISOString(),
      createdAt: entity.created_at.toISOString(),
    };
  }

  async findAll(): Promise<CargoBarcodeResponseDto[]> {
    const entities = await this.cargoBarcodeRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<CargoBarcodeResponseDto> {
    const entity = await this.cargoBarcodeRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Cargo barcode with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByCargoId(cargoId: number): Promise<CargoBarcodeResponseDto> {
    const entity = await this.cargoBarcodeRepository.findByCargoId(cargoId);
    if (!entity) {
      throw new NotFoundException(
        `Cargo barcode for cargo ${cargoId} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByBarcodeValue(
    barcodeValue: string,
  ): Promise<CargoBarcodeResponseDto> {
    const entity =
      await this.cargoBarcodeRepository.findByBarcodeValue(barcodeValue);
    if (!entity) {
      throw new NotFoundException(
        `Cargo barcode with value ${barcodeValue} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByBarcodeType(
    barcodeType: string,
  ): Promise<CargoBarcodeResponseDto[]> {
    const entities =
      await this.cargoBarcodeRepository.findByBarcodeType(barcodeType);
    return entities.map((entity) => this.mapToDto(entity));
  }
}

@Injectable()
export class CargoQrCodeService {
  constructor(
    private readonly cargoQrCodeRepository: CargoQrCodeRepository,
  ) {}

  private mapToDto(entity: CargoQrCodeEntity): CargoQrCodeResponseDto {
    return {
      id: entity.id,
      cargoId: entity.cargo_id,
      qrCodeValue: entity.qr_code_value,
      qrCodeImageReference: entity.qr_code_image_reference ?? undefined,
      generatedAt: entity.generated_at.toISOString(),
      createdAt: entity.created_at.toISOString(),
    };
  }

  async findAll(): Promise<CargoQrCodeResponseDto[]> {
    const entities = await this.cargoQrCodeRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<CargoQrCodeResponseDto> {
    const entity = await this.cargoQrCodeRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Cargo QR code with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByCargoId(cargoId: number): Promise<CargoQrCodeResponseDto> {
    const entity = await this.cargoQrCodeRepository.findByCargoId(cargoId);
    if (!entity) {
      throw new NotFoundException(
        `Cargo QR code for cargo ${cargoId} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByQrCodeValue(
    qrCodeValue: string,
  ): Promise<CargoQrCodeResponseDto> {
    const entity =
      await this.cargoQrCodeRepository.findByQrCodeValue(qrCodeValue);
    if (!entity) {
      throw new NotFoundException(
        `Cargo QR code with value ${qrCodeValue} not found`,
      );
    }
    return this.mapToDto(entity);
  }
}
