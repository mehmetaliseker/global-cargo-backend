import { Module } from '@nestjs/common';
import { HrKpiModule } from './hr-kpi/hr-kpi.module';
import { EmployeeSalaryModule } from './employee-salary/employee-salary.module';
import { EmployeeLeaveRequestModule } from './employee-leave-request/employee-leave-request.module';
import { EmployeeTrainingModule } from './employee-training/employee-training.module';
import { EmployeePerformanceRewardModule } from './employee-performance-reward/employee-performance-reward.module';

@Module({
  imports: [
    HrKpiModule,
    EmployeeSalaryModule,
    EmployeeLeaveRequestModule,
    EmployeeTrainingModule,
    EmployeePerformanceRewardModule,
  ],
  exports: [
    HrKpiModule,
    EmployeeSalaryModule,
    EmployeeLeaveRequestModule,
    EmployeeTrainingModule,
    EmployeePerformanceRewardModule,
  ],
})
export class HrModule {}

