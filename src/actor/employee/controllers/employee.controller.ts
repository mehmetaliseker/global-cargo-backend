import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { EmployeeService } from '../services/employee.service';
import { EmployeeResponseDto } from '../dto/employee.dto';

@Controller('actors/employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  async findAll(): Promise<EmployeeResponseDto[]> {
    return await this.employeeService.findAll();
  }

  @Get('active')
  async findActive(): Promise<EmployeeResponseDto[]> {
    return await this.employeeService.findActive();
  }

  @Get('country/:countryId')
  async findByCountryId(
    @Param('countryId', ParseIntPipe) countryId: number,
  ): Promise<EmployeeResponseDto[]> {
    return await this.employeeService.findByCountryId(countryId);
  }

  @Get('country/:countryId/active')
  async findByCountryIdAndActive(
    @Param('countryId', ParseIntPipe) countryId: number,
  ): Promise<EmployeeResponseDto[]> {
    return await this.employeeService.findByCountryIdAndActive(countryId);
  }

  @Get('employee-number/:employeeNumber')
  async findByEmployeeNumber(
    @Param('employeeNumber') employeeNumber: string,
  ): Promise<EmployeeResponseDto> {
    return await this.employeeService.findByEmployeeNumber(employeeNumber);
  }

  @Get('actor/:actorId')
  async findByActorId(
    @Param('actorId', ParseIntPipe) actorId: number,
  ): Promise<EmployeeResponseDto> {
    return await this.employeeService.findByActorId(actorId);
  }

  @Get('uuid/:uuid')
  async findByUuid(@Param('uuid') uuid: string): Promise<EmployeeResponseDto> {
    return await this.employeeService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EmployeeResponseDto> {
    return await this.employeeService.findById(id);
  }
}

