import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApprovalRequestService } from '../services/approval-request.service';
import { ApprovalRequestResponseDto } from '../dto/approval-request.dto';

@Controller('workflow/approval-requests')
export class ApprovalRequestController {
    constructor(
        private readonly approvalRequestService: ApprovalRequestService,
    ) { }

    @Get()
    async findAll(): Promise<ApprovalRequestResponseDto[]> {
        return await this.approvalRequestService.findAll();
    }

    @Get('pending')
    async findPending(): Promise<ApprovalRequestResponseDto[]> {
        return await this.approvalRequestService.findPending();
    }

    @Get('status/:status')
    async findByStatus(
        @Param('status') status: string,
    ): Promise<ApprovalRequestResponseDto[]> {
        return await this.approvalRequestService.findByStatus(status);
    }

    @Get('entity/:entityType/:entityId')
    async findByEntity(
        @Param('entityType') entityType: string,
        @Param('entityId', ParseIntPipe) entityId: number,
    ): Promise<ApprovalRequestResponseDto[]> {
        return await this.approvalRequestService.findByEntity(entityType, entityId);
    }

    @Get('uuid/:uuid')
    async findByUuid(
        @Param('uuid') uuid: string,
    ): Promise<ApprovalRequestResponseDto> {
        return await this.approvalRequestService.findByUuid(uuid);
    }

    @Get(':id')
    async findById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ApprovalRequestResponseDto> {
        return await this.approvalRequestService.findById(id);
    }
}
