import {
    IsNumber,
    IsString,
    IsBoolean,
    IsOptional,
    IsObject,
    IsIn,
    IsDateString,
    IsUUID,
} from 'class-validator';

export class ComplianceAuditResponseDto {
    @IsNumber()
    id: number;

    @IsUUID()
    uuid: string;

    @IsString()
    auditType: string;

    @IsDateString()
    auditDate: string;

    @IsOptional()
    @IsString()
    auditorName?: string;

    @IsOptional()
    @IsString()
    auditorOrganization?: string;

    @IsOptional()
    @IsObject()
    findings?: any;

    @IsString()
    @IsIn(['compliant', 'non_compliant', 'partial'])
    complianceStatus: string;

    @IsOptional()
    @IsObject()
    actionItems?: any;

    @IsOptional()
    @IsDateString()
    followUpDate?: string;

    @IsBoolean()
    followUpCompleted: boolean;

    @IsString()
    createdAt: string;

    @IsString()
    updatedAt: string;
}
