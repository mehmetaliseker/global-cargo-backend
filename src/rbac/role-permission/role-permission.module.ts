import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { RolePermissionRepository } from './repositories/role-permission.repository';
import { RolePermissionService } from './services/role-permission.service';
import { RolePermissionController } from './controllers/role-permission.controller';
import { RoleModule } from '../role/role.module';
import { PermissionModule } from '../permission/permission.module';

@Module({
  imports: [DatabaseModule, RoleModule, PermissionModule],
  controllers: [RolePermissionController],
  providers: [RolePermissionRepository, RolePermissionService],
  exports: [RolePermissionService, RolePermissionRepository],
})
export class RolePermissionModule {}

