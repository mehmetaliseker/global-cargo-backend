import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { EmployeeSalaryRepository } from './repositories/employee-salary.repository';
import { EmployeeSalaryService } from './services/employee-salary.service';
import { EmployeeSalaryController } from './controllers/employee-salary.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [EmployeeSalaryController],
  providers: [EmployeeSalaryRepository, EmployeeSalaryService],
  exports: [EmployeeSalaryService, EmployeeSalaryRepository],
})
export class EmployeeSalaryModule {}

