import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { DistrictRepository } from './repositories/district.repository';
import { DistrictService } from './services/district.service';
import { DistrictController } from './controllers/district.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [DistrictController],
  providers: [DistrictRepository, DistrictService],
  exports: [DistrictService, DistrictRepository],
})
export class DistrictModule {}

