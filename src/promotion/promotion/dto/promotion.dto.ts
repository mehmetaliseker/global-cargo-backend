import {
    IsNumber,
    IsString,
    IsBoolean,
    IsOptional,
    IsIn,
    IsObject,
} from 'class-validator';

export class PromotionResponseDto {
    @IsNumber()
    id: number;

    @IsString()
    uuid: string;

    @IsString()
    promotionCode: string;

    @IsString()
    promotionName: string;

    @IsString()
    @IsIn(['percentage', 'fixed_amount'])
    discountType: string;

    @IsNumber()
    discountValue: number;

    @IsString()
    validFrom: string;

    @IsOptional()
    @IsString()
    validTo?: string;

    @IsOptional()
    @IsNumber()
    usageLimit?: number;

    @IsNumber()
    usedCount: number;

    @IsOptional()
    @IsNumber()
    minPurchaseAmount?: number;

    @IsOptional()
    @IsNumber()
    maxDiscountAmount?: number;

    @IsOptional()
    @IsObject()
    applicableToCargoTypes?: any;

    @IsOptional()
    @IsObject()
    applicableToShipmentTypes?: any;

    @IsBoolean()
    isActive: boolean;

    @IsString()
    createdAt: string;

    @IsString()
    updatedAt: string;
}
