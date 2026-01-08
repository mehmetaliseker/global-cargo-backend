import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { PackagingTypeRepository } from './repositories/packaging-type.repository';
import { PackagingTypeService } from './services/packaging-type.service';
import { PackagingTypeController } from './controllers/packaging-type.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [PackagingTypeController],
  providers: [PackagingTypeRepository, PackagingTypeService],
  exports: [PackagingTypeService, PackagingTypeRepository],
})
export class PackagingTypeModule {}
