import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CityRepository } from './repositories/city.repository';
import { CityService } from './services/city.service';
import { CityController } from './controllers/city.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CityController],
  providers: [CityRepository, CityService],
  exports: [CityService, CityRepository],
})
export class CityModule {}

