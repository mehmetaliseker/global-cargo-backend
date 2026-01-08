import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EmployeeTrainingService } from '../services/employee-training.service';
import {
  EmployeeTrainingResponseDto,
  CreateEmployeeTrainingDto,
  UpdateEmployeeTrainingDto,
} from '../dto/employee-training.dto';

@Controller('hr/trainings')
export class EmployeeTrainingController {
  constructor(
    private readonly employeeTrainingService: EmployeeTrainingService,
  ) {}

  @Get()
  async findAll(): Promise<EmployeeTrainingResponseDto[]> {
    return await this.employeeTrainingService.findAll();
  }

  @Get('employee/:employeeId')
  async findByEmployeeId(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ): Promise<EmployeeTrainingResponseDto[]> {
    return await this.employeeTrainingService.findByEmployeeId(employeeId);
  }

  @Get('employee/:employeeId/certified')
  async findByEmployeeIdAndCertified(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Query('certified') certified: string,
  ): Promise<EmployeeTrainingResponseDto[]> {
    const isCertified = certified === 'true';
    return await this.employeeTrainingService.findByEmployeeIdAndCertified(
      employeeId,
      isCertified,
    );
  }

  @Get('training-level/:trainingLevel')
  async findByTrainingLevel(
    @Param('trainingLevel') trainingLevel: string,
  ): Promise<EmployeeTrainingResponseDto[]> {
    return await this.employeeTrainingService.findByTrainingLevel(trainingLevel);
  }

  @Get('training-type/:trainingType')
  async findByTrainingType(
    @Param('trainingType') trainingType: string,
  ): Promise<EmployeeTrainingResponseDto[]> {
    return await this.employeeTrainingService.findByTrainingType(trainingType);
  }

  @Get('certified')
  async findByCertified(
    @Query('certified') certified: string,
  ): Promise<EmployeeTrainingResponseDto[]> {
    const isCertified = certified === 'true';
    return await this.employeeTrainingService.findByCertified(isCertified);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EmployeeTrainingResponseDto> {
    return await this.employeeTrainingService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: CreateEmployeeTrainingDto,
  ): Promise<EmployeeTrainingResponseDto> {
    return await this.employeeTrainingService.create(createDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateEmployeeTrainingDto,
  ): Promise<EmployeeTrainingResponseDto> {
    return await this.employeeTrainingService.update(id, updateDto);
  }
}

