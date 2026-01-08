import {
    IsNumber,
    IsString,
    IsBoolean,
    IsOptional,
    IsObject,
    IsIn,
    IsUUID,
} from 'class-validator';

export class DashboardConfigResponseDto {
    @IsNumber()
    id: number;

    @IsUUID()
    uuid: string;

    @IsNumber()
    userId: number;

    @IsString()
    @IsIn(['customer', 'employee', 'admin'])
    userType: string;

    @IsString()
    dashboardName: string;

    @IsObject()
    layout: any;

    @IsBoolean()
    isDefault: boolean;

    @IsString()
    createdAt: string;

    @IsString()
    updatedAt: string;
}
