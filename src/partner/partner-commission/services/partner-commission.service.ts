import { Injectable, NotFoundException } from '@nestjs/common';
import { PartnerCommissionRepository } from '../repositories/partner-commission.repository';
import { PartnerCommissionResponseDto } from '../dto/partner-commission.dto';
import { PartnerCommissionEntity } from '../repositories/partner-commission.repository.interface';

@Injectable()
export class PartnerCommissionService {
    constructor(
        private readonly partnerCommissionRepository: PartnerCommissionRepository,
    ) { }

    private mapToDto(entity: PartnerCommissionEntity): PartnerCommissionResponseDto {
        return {
            id: entity.id,
            partnerId: entity.partner_id,
            commissionType: entity.commission_type,
            commissionRate: parseFloat(entity.commission_rate.toString()),
            applicableToCargoTypes: entity.applicable_to_cargo_types ?? undefined,
            applicableToShipmentTypes: entity.applicable_to_shipment_types ?? undefined,
            validFrom: entity.valid_from.toISOString(),
            validTo: entity.valid_to ? entity.valid_to.toISOString() : undefined,
            isActive: entity.is_active,
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString(),
        };
    }

    async findAll(): Promise<PartnerCommissionResponseDto[]> {
        const entities = await this.partnerCommissionRepository.findAll();
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findById(id: number): Promise<PartnerCommissionResponseDto> {
        const entity = await this.partnerCommissionRepository.findById(id);
        if (!entity) {
            throw new NotFoundException(`Partner commission with id ${id} not found`);
        }
        return this.mapToDto(entity);
    }

    async findByPartnerId(partnerId: number): Promise<PartnerCommissionResponseDto[]> {
        const entities = await this.partnerCommissionRepository.findByPartnerId(partnerId);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findByPartnerIdActive(partnerId: number): Promise<PartnerCommissionResponseDto[]> {
        const entities = await this.partnerCommissionRepository.findByPartnerIdActive(partnerId);
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findActiveByDateRange(startDate: string, endDate: string): Promise<PartnerCommissionResponseDto[]> {
        const entities = await this.partnerCommissionRepository.findActiveByDateRange(
            new Date(startDate),
            new Date(endDate),
        );
        return entities.map((entity) => this.mapToDto(entity));
    }

    async findActive(): Promise<PartnerCommissionResponseDto[]> {
        const entities = await this.partnerCommissionRepository.findActive();
        return entities.map((entity) => this.mapToDto(entity));
    }
}
