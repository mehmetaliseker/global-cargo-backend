import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CargoTypeRepository } from './repositories/cargo-type.repository';
import { CargoTypeService } from './services/cargo-type.service';
import { CargoTypeController } from './controllers/cargo-type.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CargoTypeController],
  providers: [CargoTypeRepository, CargoTypeService],
  exports: [CargoTypeService, CargoTypeRepository],
})
export class CargoTypeModule {}

