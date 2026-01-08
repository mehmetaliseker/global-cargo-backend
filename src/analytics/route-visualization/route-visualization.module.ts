import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { RouteVisualizationRepository } from './repositories/route-visualization.repository';
import { RouteVisualizationService } from './services/route-visualization.service';
import { RouteVisualizationController } from './controllers/route-visualization.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [RouteVisualizationController],
    providers: [RouteVisualizationRepository, RouteVisualizationService],
    exports: [RouteVisualizationService, RouteVisualizationRepository],
})
export class RouteVisualizationModule { }
