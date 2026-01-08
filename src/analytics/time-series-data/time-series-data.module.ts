import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { TimeSeriesDataRepository } from './repositories/time-series-data.repository';
import { TimeSeriesDataService } from './services/time-series-data.service';
import { TimeSeriesDataController } from './controllers/time-series-data.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [TimeSeriesDataController],
    providers: [TimeSeriesDataRepository, TimeSeriesDataService],
    exports: [TimeSeriesDataService, TimeSeriesDataRepository],
})
export class TimeSeriesDataModule { }
