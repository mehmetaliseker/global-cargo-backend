import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { StateRepository } from './repositories/state.repository';
import { StateService } from './services/state.service';
import { StateController } from './controllers/state.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [StateController],
  providers: [StateRepository, StateService],
  exports: [StateService, StateRepository],
})
export class StateModule {}

