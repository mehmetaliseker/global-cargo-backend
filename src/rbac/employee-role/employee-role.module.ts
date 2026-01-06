import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { EmployeeRoleRepository } from './repositories/employee-role.repository';
import { EmployeeRoleService } from './services/employee-role.service';
import { EmployeeRoleController } from './controllers/employee-role.controller';
import { RoleModule } from '../role/role.module';
import { EmployeeModule } from '../../actor/employee/employee.module';

@Module({
  imports: [DatabaseModule, RoleModule, EmployeeModule],
  controllers: [EmployeeRoleController],
  providers: [EmployeeRoleRepository, EmployeeRoleService],
  exports: [EmployeeRoleService, EmployeeRoleRepository],
})
export class EmployeeRoleModule {}

