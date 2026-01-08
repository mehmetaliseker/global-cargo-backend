import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ContainerCargoAssignmentRepository } from './repositories/container-cargo-assignment.repository';
import { ContainerCargoAssignmentService } from './services/container-cargo-assignment.service';
import { ContainerCargoAssignmentController } from './controllers/container-cargo-assignment.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [ContainerCargoAssignmentController],
    providers: [
        ContainerCargoAssignmentRepository,
        ContainerCargoAssignmentService,
    ],
    exports: [
        ContainerCargoAssignmentService,
        ContainerCargoAssignmentRepository,
    ],
})
export class ContainerCargoAssignmentModule { }
