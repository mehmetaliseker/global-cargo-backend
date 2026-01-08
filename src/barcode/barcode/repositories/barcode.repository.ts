import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  CargoBarcodeEntity,
  ICargoBarcodeRepository,
  CargoQrCodeEntity,
  ICargoQrCodeRepository,
} from './barcode.repository.interface';

@Injectable()
export class CargoBarcodeRepository implements ICargoBarcodeRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<CargoBarcodeEntity[]> {
    const query = `
      SELECT id, cargo_id, barcode_type, barcode_value, barcode_image_reference,
             generated_at, created_at
      FROM cargo_barcode
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CargoBarcodeEntity>(query);
  }

  async findById(id: number): Promise<CargoBarcodeEntity | null> {
    const query = `
      SELECT id, cargo_id, barcode_type, barcode_value, barcode_image_reference,
             generated_at, created_at
      FROM cargo_barcode
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<CargoBarcodeEntity>(query, [id]);
  }

  async findByCargoId(cargoId: number): Promise<CargoBarcodeEntity | null> {
    const query = `
      SELECT id, cargo_id, barcode_type, barcode_value, barcode_image_reference,
             generated_at, created_at
      FROM cargo_barcode
      WHERE cargo_id = $1
    `;
    return await this.databaseService.queryOne<CargoBarcodeEntity>(query, [
      cargoId,
    ]);
  }

  async findByBarcodeValue(
    barcodeValue: string,
  ): Promise<CargoBarcodeEntity | null> {
    const query = `
      SELECT id, cargo_id, barcode_type, barcode_value, barcode_image_reference,
             generated_at, created_at
      FROM cargo_barcode
      WHERE barcode_value = $1
    `;
    return await this.databaseService.queryOne<CargoBarcodeEntity>(query, [
      barcodeValue,
    ]);
  }

  async findByBarcodeType(
    barcodeType: string,
  ): Promise<CargoBarcodeEntity[]> {
    const query = `
      SELECT id, cargo_id, barcode_type, barcode_value, barcode_image_reference,
             generated_at, created_at
      FROM cargo_barcode
      WHERE barcode_type = $1
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CargoBarcodeEntity>(query, [
      barcodeType,
    ]);
  }
}

@Injectable()
export class CargoQrCodeRepository implements ICargoQrCodeRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<CargoQrCodeEntity[]> {
    const query = `
      SELECT id, cargo_id, qr_code_value, qr_code_image_reference,
             generated_at, created_at
      FROM cargo_qr_code
      ORDER BY created_at DESC
    `;
    return await this.databaseService.query<CargoQrCodeEntity>(query);
  }

  async findById(id: number): Promise<CargoQrCodeEntity | null> {
    const query = `
      SELECT id, cargo_id, qr_code_value, qr_code_image_reference,
             generated_at, created_at
      FROM cargo_qr_code
      WHERE id = $1
    `;
    return await this.databaseService.queryOne<CargoQrCodeEntity>(query, [id]);
  }

  async findByCargoId(cargoId: number): Promise<CargoQrCodeEntity | null> {
    const query = `
      SELECT id, cargo_id, qr_code_value, qr_code_image_reference,
             generated_at, created_at
      FROM cargo_qr_code
      WHERE cargo_id = $1
    `;
    return await this.databaseService.queryOne<CargoQrCodeEntity>(query, [
      cargoId,
    ]);
  }

  async findByQrCodeValue(
    qrCodeValue: string,
  ): Promise<CargoQrCodeEntity | null> {
    const query = `
      SELECT id, cargo_id, qr_code_value, qr_code_image_reference,
             generated_at, created_at
      FROM cargo_qr_code
      WHERE qr_code_value = $1
    `;
    return await this.databaseService.queryOne<CargoQrCodeEntity>(query, [
      qrCodeValue,
    ]);
  }
}
