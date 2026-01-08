import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { RegionalConfigRepository } from './repositories/regional-config.repository';
import { RegionalConfigService } from './services/regional-config.service';
import { RegionalConfigController } from './controllers/regional-config.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [RegionalConfigController],
    providers: [RegionalConfigRepository, RegionalConfigService],
    exports: [RegionalConfigService, RegionalConfigRepository],
})
export class RegionalConfigModule { }
