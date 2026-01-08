import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ContainerRepository } from './repositories/container.repository';
import { ContainerService } from './services/container.service';
import { ContainerController } from './controllers/container.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [ContainerController],
    providers: [ContainerRepository, ContainerService],
    exports: [ContainerService, ContainerRepository],
})
export class ContainerModule { }
