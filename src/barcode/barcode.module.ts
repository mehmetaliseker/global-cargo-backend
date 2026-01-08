import { Module } from '@nestjs/common';
import { BarcodeModule as CargoBarcodeModule } from './barcode/barcode.module';
import { PackagingTypeModule } from './packaging-type/packaging-type.module';
import { LabelTemplateModule } from './label-template/label-template.module';
import { LabelPrintModule } from './label-print/label-print.module';

@Module({
  imports: [
    CargoBarcodeModule,
    PackagingTypeModule,
    LabelTemplateModule,
    LabelPrintModule,
  ],
  exports: [
    CargoBarcodeModule,
    PackagingTypeModule,
    LabelTemplateModule,
    LabelPrintModule,
  ],
})
export class BarcodeModule {}
