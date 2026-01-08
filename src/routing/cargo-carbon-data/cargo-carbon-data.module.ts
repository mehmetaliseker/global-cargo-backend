import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CargoCarbonDataRepository } from './repositories/cargo-carbon-data.repository';
import { CargoCarbonDataService } from './services/cargo-carbon-data.service';
import { CargoCarbonDataController } from './controllers/cargo-carbon-data.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CargoCarbonDataController],
  providers: [CargoCarbonDataRepository, CargoCarbonDataService],
  exports: [CargoCarbonDataService, CargoCarbonDataRepository],
})
export class CargoCarbonDataModule {}

