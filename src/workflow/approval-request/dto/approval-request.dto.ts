import {
    IsNumber,
    IsString,
    IsOptional,
} from 'class-validator';

export class ApprovalRequestResponseDto {
    @IsNumber()
    id: number;

    @IsString()
    uuid: string;

    @IsNumber()
    approvalChainId: number;

    @IsString()
    entityType: string;

    @IsNumber()
    entityId: number;

    @IsOptional()
    @IsNumber()
    requestedBy?: number;

    @IsNumber()
    currentLevel: number;

    @IsString()
    status: string;

    @IsString()
    requestedDate: string;

    @IsOptional()
    @IsString()
    completedDate?: string;

    @IsString()
    createdAt: string;

    @IsString()
    updatedAt: string;
}
