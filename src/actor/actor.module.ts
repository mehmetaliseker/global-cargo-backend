import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ActorRepository } from './repositories/actor.repository';
import { ActorService } from './services/actor.service';
import { ActorController } from './controllers/actor.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ActorController],
  providers: [ActorRepository, ActorService],
  exports: [ActorService, ActorRepository],
})
export class ActorModule {}

