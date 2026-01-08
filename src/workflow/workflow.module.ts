import { Module } from '@nestjs/common';
import { WorkflowDefinitionModule } from './workflow-definition/workflow-definition.module';
import { ApprovalRequestModule } from './approval-request/approval-request.module';

@Module({
    imports: [WorkflowDefinitionModule, ApprovalRequestModule],
    exports: [WorkflowDefinitionModule, ApprovalRequestModule],
})
export class WorkflowModule { }
