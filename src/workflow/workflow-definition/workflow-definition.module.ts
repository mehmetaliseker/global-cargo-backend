import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { WorkflowDefinitionRepository } from './repositories/workflow-definition.repository';
import { WorkflowDefinitionService } from './services/workflow-definition.service';
import { WorkflowDefinitionController } from './controllers/workflow-definition.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [WorkflowDefinitionController],
    providers: [WorkflowDefinitionRepository, WorkflowDefinitionService],
    exports: [WorkflowDefinitionService, WorkflowDefinitionRepository],
})
export class WorkflowDefinitionModule { }
