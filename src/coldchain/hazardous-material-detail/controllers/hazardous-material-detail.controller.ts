import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { HazardousMaterialDetailService } from '../services/hazardous-material-detail.service';
import { HazardousMaterialDetailResponseDto } from '../dto/hazardous-material-detail.dto';

@Controller('coldchain/hazmat')
export class HazardousMaterialDetailController {
    constructor(
        private readonly hazardousMaterialDetailService: HazardousMaterialDetailService,
    ) { }

    @Get()
    async findAll(): Promise<HazardousMaterialDetailResponseDto[]> {
        return await this.hazardousMaterialDetailService.findAll();
    }

    @Get('class/:hazardClass')
    async findByHazardClass(
        @Param('hazardClass') hazardClass: string,
    ): Promise<HazardousMaterialDetailResponseDto[]> {
        return await this.hazardousMaterialDetailService.findByHazardClass(
            hazardClass,
        );
    }

    @Get('cargo/:cargoId')
    async findByCargoId(
        @Param('cargoId', ParseIntPipe) cargoId: number,
    ): Promise<HazardousMaterialDetailResponseDto> {
        return await this.hazardousMaterialDetailService.findByCargoId(cargoId);
    }

    @Get(':id')
    async findById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<HazardousMaterialDetailResponseDto> {
        return await this.hazardousMaterialDetailService.findById(id);
    }
}
