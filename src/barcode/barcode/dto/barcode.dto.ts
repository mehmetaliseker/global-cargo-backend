import {
  IsNumber,
  IsString,
  IsOptional,
} from 'class-validator';

export class CargoBarcodeResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  cargoId: number;

  @IsString()
  barcodeType: string;

  @IsString()
  barcodeValue: string;

  @IsOptional()
  @IsString()
  barcodeImageReference?: string;

  @IsString()
  generatedAt: string;

  @IsString()
  createdAt: string;
}

export class CargoQrCodeResponseDto {
  @IsNumber()
  id: number;

  @IsNumber()
  cargoId: number;

  @IsString()
  qrCodeValue: string;

  @IsOptional()
  @IsString()
  qrCodeImageReference?: string;

  @IsString()
  generatedAt: string;

  @IsString()
  createdAt: string;
}
