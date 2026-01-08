import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { EmployeeTrainingRepository } from './repositories/employee-training.repository';
import { EmployeeTrainingService } from './services/employee-training.service';
import { EmployeeTrainingController } from './controllers/employee-training.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [EmployeeTrainingController],
  providers: [EmployeeTrainingRepository, EmployeeTrainingService],
  exports: [EmployeeTrainingService, EmployeeTrainingRepository],
})
export class EmployeeTrainingModule {}

