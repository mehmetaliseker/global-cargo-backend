import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { SystemConfigRepository } from './repositories/system-config.repository';
import { SystemConfigService } from './services/system-config.service';
import { SystemConfigController } from './controllers/system-config.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [SystemConfigController],
  providers: [SystemConfigRepository, SystemConfigService],
  exports: [SystemConfigService, SystemConfigRepository],
})
export class SystemConfigModule {}
