import { Module } from '@nestjs/common';
import { CustomsDocumentTypeModule } from './customs-document-type/customs-document-type.module';
import { CargoCustomsDocumentModule } from './cargo-customs-document/cargo-customs-document.module';
import { TaxRegulationVersionModule } from './tax-regulation-version/tax-regulation-version.module';
import { CustomsTaxCalculationModule } from './customs-tax-calculation/customs-tax-calculation.module';

@Module({
  imports: [
    CustomsDocumentTypeModule,
    CargoCustomsDocumentModule,
    TaxRegulationVersionModule,
    CustomsTaxCalculationModule,
  ],
  exports: [
    CustomsDocumentTypeModule,
    CargoCustomsDocumentModule,
    TaxRegulationVersionModule,
    CustomsTaxCalculationModule,
  ],
})
export class CustomsModule {}

