import { Module } from '@nestjs/common';
import { ColdChainCargoModule } from './cold-chain-cargo/cold-chain-cargo.module';
import { HazardousMaterialDetailModule } from './hazardous-material-detail/hazardous-material-detail.module';

@Module({
    imports: [ColdChainCargoModule, HazardousMaterialDetailModule],
    exports: [ColdChainCargoModule, HazardousMaterialDetailModule],
})
export class ColdchainModule { }
