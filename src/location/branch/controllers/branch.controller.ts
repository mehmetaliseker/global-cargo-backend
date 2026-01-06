import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { BranchService } from '../services/branch.service';
import { BranchResponseDto } from '../dto/branch.dto';

@Controller('location/branches')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Get()
  async findAll(): Promise<BranchResponseDto[]> {
    return await this.branchService.findAll();
  }

  @Get('active')
  async findActive(): Promise<BranchResponseDto[]> {
    return await this.branchService.findActive();
  }

  @Get('district/:districtId')
  async findByDistrictId(
    @Param('districtId', ParseIntPipe) districtId: number,
  ): Promise<BranchResponseDto[]> {
    return await this.branchService.findByDistrictId(districtId);
  }

  @Get('district/:districtId/active')
  async findByDistrictIdAndActive(
    @Param('districtId', ParseIntPipe) districtId: number,
  ): Promise<BranchResponseDto[]> {
    return await this.branchService.findByDistrictIdAndActive(districtId);
  }

  @Get('uuid/:uuid')
  async findByUuid(@Param('uuid') uuid: string): Promise<BranchResponseDto> {
    return await this.branchService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BranchResponseDto> {
    return await this.branchService.findById(id);
  }
}

