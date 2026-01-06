import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ShipmentTypeRepository } from './repositories/shipment-type.repository';
import { ShipmentTypeService } from './services/shipment-type.service';
import { ShipmentTypeController } from './controllers/shipment-type.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ShipmentTypeController],
  providers: [ShipmentTypeRepository, ShipmentTypeService],
  exports: [ShipmentTypeService, ShipmentTypeRepository],
})
export class ShipmentTypeModule {}

