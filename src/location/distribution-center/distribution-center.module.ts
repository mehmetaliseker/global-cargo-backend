import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { DistributionCenterRepository } from './repositories/distribution-center.repository';
import { DistributionCenterService } from './services/distribution-center.service';
import { DistributionCenterController } from './controllers/distribution-center.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [DistributionCenterController],
  providers: [DistributionCenterRepository, DistributionCenterService],
  exports: [DistributionCenterService, DistributionCenterRepository],
})
export class DistributionCenterModule {}

