import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { WorkflowDefinitionService } from '../services/workflow-definition.service';
import { WorkflowDefinitionResponseDto } from '../dto/workflow-definition.dto';

@Controller('workflow/definitions')
export class WorkflowDefinitionController {
    constructor(
        private readonly workflowDefinitionService: WorkflowDefinitionService,
    ) { }

    @Get()
    async findAll(): Promise<WorkflowDefinitionResponseDto[]> {
        return await this.workflowDefinitionService.findAll();
    }

    @Get('active')
    async findActive(): Promise<WorkflowDefinitionResponseDto[]> {
        return await this.workflowDefinitionService.findActive();
    }

    @Get('type/:workflowType')
    async findByWorkflowType(
        @Param('workflowType') workflowType: string,
    ): Promise<WorkflowDefinitionResponseDto[]> {
        return await this.workflowDefinitionService.findByWorkflowType(workflowType);
    }

    @Get('code/:workflowCode')
    async findByWorkflowCode(
        @Param('workflowCode') workflowCode: string,
    ): Promise<WorkflowDefinitionResponseDto> {
        return await this.workflowDefinitionService.findByWorkflowCode(workflowCode);
    }

    @Get('uuid/:uuid')
    async findByUuid(
        @Param('uuid') uuid: string,
    ): Promise<WorkflowDefinitionResponseDto> {
        return await this.workflowDefinitionService.findByUuid(uuid);
    }

    @Get(':id')
    async findById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<WorkflowDefinitionResponseDto> {
        return await this.workflowDefinitionService.findById(id);
    }
}
