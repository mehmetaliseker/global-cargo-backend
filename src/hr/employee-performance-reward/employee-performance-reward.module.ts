import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { EmployeePerformanceRewardRepository } from './repositories/employee-performance-reward.repository';
import { EmployeePerformanceRewardService } from './services/employee-performance-reward.service';
import { EmployeePerformanceRewardController } from './controllers/employee-performance-reward.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [EmployeePerformanceRewardController],
  providers: [
    EmployeePerformanceRewardRepository,
    EmployeePerformanceRewardService,
  ],
  exports: [
    EmployeePerformanceRewardService,
    EmployeePerformanceRewardRepository,
  ],
})
export class EmployeePerformanceRewardModule {}

