import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import {
  CustomerSegmentRepository,
  CustomerSegmentAssignmentRepository,
  CustomerTagRepository,
  CustomerTagAssignmentRepository,
} from './repositories/customer-segment.repository';
import {
  CustomerSegmentService,
  CustomerSegmentAssignmentService,
  CustomerTagService,
  CustomerTagAssignmentService,
} from './services/customer-segment.service';
import {
  CustomerSegmentController,
  CustomerSegmentAssignmentController,
  CustomerTagController,
  CustomerTagAssignmentController,
} from './controllers/customer-segment.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [
    CustomerSegmentController,
    CustomerSegmentAssignmentController,
    CustomerTagController,
    CustomerTagAssignmentController,
  ],
  providers: [
    CustomerSegmentRepository,
    CustomerSegmentAssignmentRepository,
    CustomerTagRepository,
    CustomerTagAssignmentRepository,
    CustomerSegmentService,
    CustomerSegmentAssignmentService,
    CustomerTagService,
    CustomerTagAssignmentService,
  ],
  exports: [
    CustomerSegmentService,
    CustomerSegmentAssignmentService,
    CustomerTagService,
    CustomerTagAssignmentService,
    CustomerSegmentRepository,
    CustomerSegmentAssignmentRepository,
    CustomerTagRepository,
    CustomerTagAssignmentRepository,
  ],
})
export class CustomerSegmentModule {}
