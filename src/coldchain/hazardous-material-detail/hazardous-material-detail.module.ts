import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { HazardousMaterialDetailRepository } from './repositories/hazardous-material-detail.repository';
import { HazardousMaterialDetailService } from './services/hazardous-material-detail.service';
import { HazardousMaterialDetailController } from './controllers/hazardous-material-detail.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [HazardousMaterialDetailController],
    providers: [HazardousMaterialDetailRepository, HazardousMaterialDetailService],
    exports: [HazardousMaterialDetailService, HazardousMaterialDetailRepository],
})
export class HazardousMaterialDetailModule { }
