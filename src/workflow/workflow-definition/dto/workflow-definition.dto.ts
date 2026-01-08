import {
    IsNumber,
    IsString,
    IsBoolean,
    IsObject,
} from 'class-validator';

export class WorkflowDefinitionResponseDto {
    @IsNumber()
    id: number;

    @IsString()
    uuid: string;

    @IsString()
    workflowName: string;

    @IsString()
    workflowCode: string;

    @IsString()
    workflowType: string;

    @IsObject()
    steps: any;

    @IsBoolean()
    isActive: boolean;

    @IsString()
    createdAt: string;

    @IsString()
    updatedAt: string;
}
