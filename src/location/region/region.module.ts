import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { RegionRepository } from './repositories/region.repository';
import { RegionService } from './services/region.service';
import { RegionController } from './controllers/region.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [RegionController],
  providers: [RegionRepository, RegionService],
  exports: [RegionService, RegionRepository],
})
export class RegionModule {}

