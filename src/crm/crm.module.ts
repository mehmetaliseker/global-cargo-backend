import { Module } from '@nestjs/common';
import { CustomerSegmentModule } from './customer-segment/customer-segment.module';
import { CustomerProfileModule } from './customer-profile/customer-profile.module';
import { CustomerInteractionModule } from './customer-interaction/customer-interaction.module';
import { CustomerNoteModule } from './customer-note/customer-note.module';

@Module({
  imports: [
    CustomerSegmentModule,
    CustomerProfileModule,
    CustomerInteractionModule,
    CustomerNoteModule,
  ],
  exports: [
    CustomerSegmentModule,
    CustomerProfileModule,
    CustomerInteractionModule,
    CustomerNoteModule,
  ],
})
export class CrmModule {}
