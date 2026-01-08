import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { RouteRepository } from './repositories/route.repository';
import { RouteService } from './services/route.service';
import { RouteController } from './controllers/route.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [RouteController],
  providers: [RouteRepository, RouteService],
  exports: [RouteService, RouteRepository],
})
export class RouteModule {}

