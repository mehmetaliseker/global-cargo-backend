import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EmployeeTrainingRepository } from '../repositories/employee-training.repository';
import {
  EmployeeTrainingResponseDto,
  CreateEmployeeTrainingDto,
  UpdateEmployeeTrainingDto,
} from '../dto/employee-training.dto';
import { EmployeeTrainingEntity } from '../repositories/employee-training.repository.interface';

@Injectable()
export class EmployeeTrainingService {
  constructor(
    private readonly employeeTrainingRepository: EmployeeTrainingRepository,
  ) {}

  private mapToDto(entity: EmployeeTrainingEntity): EmployeeTrainingResponseDto {
    return {
      id: entity.id,
      employeeId: entity.employee_id,
      trainingLevel: entity.training_level,
      competencyCriteria: entity.competency_criteria ?? undefined,
      trainingType: entity.training_type ?? undefined,
      completionDate: entity.completion_date?.toISOString(),
      certificateNumber: entity.certificate_number ?? undefined,
      certificateFileReference: entity.certificate_file_reference ?? undefined,
      isCertified: entity.is_certified,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<EmployeeTrainingResponseDto[]> {
    const entities = await this.employeeTrainingRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<EmployeeTrainingResponseDto> {
    const entity = await this.employeeTrainingRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Employee training with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByEmployeeId(employeeId: number): Promise<EmployeeTrainingResponseDto[]> {
    const entities = await this.employeeTrainingRepository.findByEmployeeId(
      employeeId,
    );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByTrainingLevel(
    trainingLevel: string,
  ): Promise<EmployeeTrainingResponseDto[]> {
    const entities =
      await this.employeeTrainingRepository.findByTrainingLevel(trainingLevel);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByTrainingType(
    trainingType: string,
  ): Promise<EmployeeTrainingResponseDto[]> {
    const entities =
      await this.employeeTrainingRepository.findByTrainingType(trainingType);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCertified(
    isCertified: boolean,
  ): Promise<EmployeeTrainingResponseDto[]> {
    const entities =
      await this.employeeTrainingRepository.findByCertified(isCertified);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByEmployeeIdAndCertified(
    employeeId: number,
    isCertified: boolean,
  ): Promise<EmployeeTrainingResponseDto[]> {
    const entities =
      await this.employeeTrainingRepository.findByEmployeeIdAndCertified(
        employeeId,
        isCertified,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async create(
    createDto: CreateEmployeeTrainingDto,
  ): Promise<EmployeeTrainingResponseDto> {
    if (createDto.isCertified && !createDto.certificateNumber) {
      throw new BadRequestException(
        'Certificate number is required when training is certified',
      );
    }

    const entity = await this.employeeTrainingRepository.create(
      createDto.employeeId,
      createDto.trainingLevel,
      createDto.competencyCriteria ?? null,
      createDto.trainingType ?? null,
      createDto.completionDate ? new Date(createDto.completionDate) : null,
      createDto.certificateNumber ?? null,
      createDto.certificateFileReference ?? null,
      createDto.isCertified,
    );

    return this.mapToDto(entity);
  }

  async update(
    id: number,
    updateDto: UpdateEmployeeTrainingDto,
  ): Promise<EmployeeTrainingResponseDto> {
    const existing = await this.employeeTrainingRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Employee training with id ${id} not found`);
    }

    if (updateDto.isCertified && !updateDto.certificateNumber) {
      throw new BadRequestException(
        'Certificate number is required when training is certified',
      );
    }

    const entity = await this.employeeTrainingRepository.update(
      id,
      updateDto.trainingLevel,
      updateDto.competencyCriteria ?? null,
      updateDto.trainingType ?? null,
      updateDto.completionDate ? new Date(updateDto.completionDate) : null,
      updateDto.certificateNumber ?? null,
      updateDto.certificateFileReference ?? null,
      updateDto.isCertified,
    );

    return this.mapToDto(entity);
  }

  async delete(id: number): Promise<void> {
    const existing = await this.employeeTrainingRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Employee training with id ${id} not found`);
    }

    await this.employeeTrainingRepository.softDelete(id);
  }
}

