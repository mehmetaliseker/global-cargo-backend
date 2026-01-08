import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { EmployeeLeaveRequestRepository } from './repositories/employee-leave-request.repository';
import { EmployeeLeaveRequestService } from './services/employee-leave-request.service';
import { EmployeeLeaveRequestController } from './controllers/employee-leave-request.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [EmployeeLeaveRequestController],
  providers: [EmployeeLeaveRequestRepository, EmployeeLeaveRequestService],
  exports: [EmployeeLeaveRequestService, EmployeeLeaveRequestRepository],
})
export class EmployeeLeaveRequestModule {}

