import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { FleetRepository } from './repositories/fleet.repository';
import { FleetService } from './services/fleet.service';
import { FleetController } from './controllers/fleet.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [FleetController],
    providers: [FleetRepository, FleetService],
    exports: [FleetService, FleetRepository],
})
export class FleetModule { }
