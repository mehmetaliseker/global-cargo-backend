import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { EmployeeRepository } from './repositories/employee.repository';
import { EmployeeService } from './services/employee.service';
import { EmployeeController } from './controllers/employee.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [EmployeeController],
  providers: [EmployeeRepository, EmployeeService],
  exports: [EmployeeService, EmployeeRepository],
})
export class EmployeeModule {}

