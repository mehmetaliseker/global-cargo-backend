export interface CargoBarcodeEntity {
  id: number;
  cargo_id: number;
  barcode_type: string;
  barcode_value: string;
  barcode_image_reference?: string;
  generated_at: Date;
  created_at: Date;
}

export interface CargoQrCodeEntity {
  id: number;
  cargo_id: number;
  qr_code_value: string;
  qr_code_image_reference?: string;
  generated_at: Date;
  created_at: Date;
}

export interface ICargoBarcodeRepository {
  findAll(): Promise<CargoBarcodeEntity[]>;
  findById(id: number): Promise<CargoBarcodeEntity | null>;
  findByCargoId(cargoId: number): Promise<CargoBarcodeEntity | null>;
  findByBarcodeValue(barcodeValue: string): Promise<CargoBarcodeEntity | null>;
  findByBarcodeType(barcodeType: string): Promise<CargoBarcodeEntity[]>;
}

export interface ICargoQrCodeRepository {
  findAll(): Promise<CargoQrCodeEntity[]>;
  findById(id: number): Promise<CargoQrCodeEntity | null>;
  findByCargoId(cargoId: number): Promise<CargoQrCodeEntity | null>;
  findByQrCodeValue(qrCodeValue: string): Promise<CargoQrCodeEntity | null>;
}
