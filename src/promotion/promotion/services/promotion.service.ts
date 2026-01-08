import { Injectable, NotFoundException } from '@nestjs/common';
import { PromotionRepository } from '../repositories/promotion.repository';
import { PromotionResponseDto } from '../dto/promotion.dto';
import { PromotionEntity } from '../repositories/promotion.repository.interface';

@Injectable()
export class PromotionService {
    constructor(private readonly promotionRepository: PromotionRepository) { }

    private mapToDto(entity: PromotionEntity): PromotionResponseDto {
        return {
            id: entity.id,
            uuid: entity.uuid,
            promotionCode: entity.promotion_code,
            promotionName: entity.promotion_name,
            discountType: entity.discount_type,
            discountValue: parseFloat(entity.discount_value.toString()),
            validFrom: entity.valid_from.toISOString(),
            validTo: entity.valid_to?.toISOString(),
            usageLimit: entity.usage_limit ?? undefined,
            usedCount: entity.used_count,
            minPurchaseAmount: entity.min_purchase_amount
                ? parseFloat(entity.min_purchase_amount.toString())
                : undefined,
            maxDiscountAmount: entity.max_discount_amount
                ? parseFloat(entity.max_discount_amount.toString())
                : undefined,
            applicableToCargoTypes: entity.applicable_to_cargo_types ?? undefined,
            applicableToShipmentTypes:
                entity.applicable_to_shipment_types ?? undefined,
            isActive: entity.is_active,
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString(),
        };
    }

    async findAll(): Promise<PromotionResponseDto[]> {
        const entities = await this.promotionRepository.findAll();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findById(id: number): Promise<PromotionResponseDto> {
        const entity = await this.promotionRepository.findById(id);
        if (!entity) {
            throw new NotFoundException(`Promotion with id ${id} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByUuid(uuid: string): Promise<PromotionResponseDto> {
        const entity = await this.promotionRepository.findByUuid(uuid);
        if (!entity) {
            throw new NotFoundException(`Promotion with uuid ${uuid} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByPromotionCode(
        promotionCode: string,
    ): Promise<PromotionResponseDto> {
        const entity =
            await this.promotionRepository.findByPromotionCode(promotionCode);
        if (!entity) {
            throw new NotFoundException(
                `Promotion with code ${promotionCode} not found`,
            );
        }
        return this.mapToDto(entity);
    }

    async findActive(): Promise<PromotionResponseDto[]> {
        const entities = await this.promotionRepository.findActive();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findValidPromotions(): Promise<PromotionResponseDto[]> {
        const entities = await this.promotionRepository.findValidPromotions();
        return entities.map((entity) => this.mapToDto(entity));
    }
}
