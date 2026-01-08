import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { PartnerCommissionService } from '../services/partner-commission.service';
import { PartnerCommissionResponseDto } from '../dto/partner-commission.dto';

@Controller('partners/commissions')
export class PartnerCommissionController {
    constructor(
        private readonly partnerCommissionService: PartnerCommissionService,
    ) { }

    @Get()
    async findAll(): Promise<PartnerCommissionResponseDto[]> {
        return await this.partnerCommissionService.findAll();
    }

    @Get('active')
    async findActive(): Promise<PartnerCommissionResponseDto[]> {
        return await this.partnerCommissionService.findActive();
    }

    @Get('partner/:partnerId')
    async findByPartnerId(
        @Param('partnerId', ParseIntPipe) partnerId: number,
    ): Promise<PartnerCommissionResponseDto[]> {
        return await this.partnerCommissionService.findByPartnerId(partnerId);
    }

    @Get('partner/:partnerId/active')
    async findByPartnerIdActive(
        @Param('partnerId', ParseIntPipe) partnerId: number,
    ): Promise<PartnerCommissionResponseDto[]> {
        return await this.partnerCommissionService.findByPartnerIdActive(partnerId);
    }

    @Get('date-range')
    async findActiveByDateRange(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ): Promise<PartnerCommissionResponseDto[]> {
        return await this.partnerCommissionService.findActiveByDateRange(startDate, endDate);
    }

    @Get(':id')
    async findById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<PartnerCommissionResponseDto> {
        return await this.partnerCommissionService.findById(id);
    }
}
