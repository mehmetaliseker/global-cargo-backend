export interface WorkflowDefinitionEntity {
    id: number;
    uuid: string;
    workflow_name: string;
    workflow_code: string;
    workflow_type: string;
    steps: any;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}

export interface IWorkflowDefinitionRepository {
    findAll(): Promise<WorkflowDefinitionEntity[]>;
    findById(id: number): Promise<WorkflowDefinitionEntity | null>;
    findByUuid(uuid: string): Promise<WorkflowDefinitionEntity | null>;
    findByWorkflowCode(workflowCode: string): Promise<WorkflowDefinitionEntity | null>;
    findByWorkflowType(workflowType: string): Promise<WorkflowDefinitionEntity[]>;
    findActive(): Promise<WorkflowDefinitionEntity[]>;
}
