import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { PermissionRepository } from './repositories/permission.repository';
import { PermissionService } from './services/permission.service';
import { PermissionController } from './controllers/permission.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [PermissionController],
  providers: [PermissionRepository, PermissionService],
  exports: [PermissionService, PermissionRepository],
})
export class PermissionModule {}

