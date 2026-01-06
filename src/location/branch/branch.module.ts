import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { BranchRepository } from './repositories/branch.repository';
import { BranchService } from './services/branch.service';
import { BranchController } from './controllers/branch.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [BranchController],
  providers: [BranchRepository, BranchService],
  exports: [BranchService, BranchRepository],
})
export class BranchModule {}

