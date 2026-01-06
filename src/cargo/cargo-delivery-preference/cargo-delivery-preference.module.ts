import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CargoDeliveryPreferenceRepository } from './repositories/cargo-delivery-preference.repository';
import { CargoDeliveryPreferenceService } from './services/cargo-delivery-preference.service';
import { CargoDeliveryPreferenceController } from './controllers/cargo-delivery-preference.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CargoDeliveryPreferenceController],
  providers: [
    CargoDeliveryPreferenceRepository,
    CargoDeliveryPreferenceService,
  ],
  exports: [
    CargoDeliveryPreferenceService,
    CargoDeliveryPreferenceRepository,
  ],
})
export class CargoDeliveryPreferenceModule {}

