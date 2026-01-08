import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ApprovalRequestRepository } from './repositories/approval-request.repository';
import { ApprovalRequestService } from './services/approval-request.service';
import { ApprovalRequestController } from './controllers/approval-request.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [ApprovalRequestController],
    providers: [ApprovalRequestRepository, ApprovalRequestService],
    exports: [ApprovalRequestService, ApprovalRequestRepository],
})
export class ApprovalRequestModule { }
