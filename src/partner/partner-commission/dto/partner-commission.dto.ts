import {
    IsNumber,
    IsString,
    IsBoolean,
    IsOptional,
    IsObject,
    IsIn,
    IsDateString,
} from 'class-validator';

export class PartnerCommissionResponseDto {
    @IsNumber()
    id: number;

    @IsNumber()
    partnerId: number;

    @IsString()
    @IsIn(['percentage', 'fixed_amount'])
    commissionType: string;

    @IsNumber()
    commissionRate: number;

    @IsOptional()
    @IsObject()
    applicableToCargoTypes?: any;

    @IsOptional()
    @IsObject()
    applicableToShipmentTypes?: any;

    @IsDateString()
    validFrom: string;

    @IsOptional()
    @IsDateString()
    validTo?: string;

    @IsBoolean()
    isActive: boolean;

    @IsString()
    createdAt: string;

    @IsString()
    updatedAt: string;
}
