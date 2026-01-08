import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { GeoCoordinateRepository } from './repositories/geo-coordinate.repository';
import { GeoCoordinateService } from './services/geo-coordinate.service';
import { GeoCoordinateController } from './controllers/geo-coordinate.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [GeoCoordinateController],
    providers: [GeoCoordinateRepository, GeoCoordinateService],
    exports: [GeoCoordinateService, GeoCoordinateRepository],
})
export class GeoCoordinateModule { }
