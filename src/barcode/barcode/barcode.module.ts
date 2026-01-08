import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import {
  CargoBarcodeRepository,
  CargoQrCodeRepository,
} from './repositories/barcode.repository';
import {
  CargoBarcodeService,
  CargoQrCodeService,
} from './services/barcode.service';
import {
  CargoBarcodeController,
  CargoQrCodeController,
} from './controllers/barcode.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CargoBarcodeController, CargoQrCodeController],
  providers: [
    CargoBarcodeRepository,
    CargoQrCodeRepository,
    CargoBarcodeService,
    CargoQrCodeService,
  ],
  exports: [
    CargoBarcodeService,
    CargoQrCodeService,
    CargoBarcodeRepository,
    CargoQrCodeRepository,
  ],
})
export class BarcodeModule {}
