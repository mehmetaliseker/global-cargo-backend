import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { RoleRepository } from './repositories/role.repository';
import { RoleService } from './services/role.service';
import { RoleController } from './controllers/role.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [RoleController],
  providers: [RoleRepository, RoleService],
  exports: [RoleService, RoleRepository],
})
export class RoleModule {}

