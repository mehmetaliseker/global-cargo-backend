import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CargoRepository } from './repositories/cargo.repository';
import { CargoService } from './services/cargo.service';
import { CargoController } from './controllers/cargo.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CargoController],
  providers: [CargoRepository, CargoService],
  exports: [CargoService, CargoRepository],
})
export class CargoModule {}

