import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ColdChainCargoRepository } from './repositories/cold-chain-cargo.repository';
import { ColdChainCargoService } from './services/cold-chain-cargo.service';
import { ColdChainCargoController } from './controllers/cold-chain-cargo.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [ColdChainCargoController],
    providers: [ColdChainCargoRepository, ColdChainCargoService],
    exports: [ColdChainCargoService, ColdChainCargoRepository],
})
export class ColdChainCargoModule { }
