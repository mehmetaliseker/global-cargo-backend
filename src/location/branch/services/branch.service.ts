import { Injectable, NotFoundException } from '@nestjs/common';
import { BranchRepository } from '../repositories/branch.repository';
import { BranchResponseDto } from '../dto/branch.dto';
import { BranchEntity } from '../repositories/branch.repository.interface';

@Injectable()
export class BranchService {
  constructor(private readonly branchRepository: BranchRepository) {}

  private mapToDto(entity: BranchEntity): BranchResponseDto {
    return {
      id: entity.id,
      uuid: entity.uuid,
      districtId: entity.district_id,
      name: entity.name,
      code: entity.code,
      address: entity.address,
      phone: entity.phone,
      email: entity.email,
      isActive: entity.is_active,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<BranchResponseDto[]> {
    const entities = await this.branchRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<BranchResponseDto> {
    const entity = await this.branchRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Branch with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<BranchResponseDto> {
    const entity = await this.branchRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(`Branch with uuid ${uuid} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByDistrictId(districtId: number): Promise<BranchResponseDto[]> {
    const entities = await this.branchRepository.findByDistrictId(districtId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findActive(): Promise<BranchResponseDto[]> {
    const entities = await this.branchRepository.findActive();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByDistrictIdAndActive(
    districtId: number,
  ): Promise<BranchResponseDto[]> {
    const entities =
      await this.branchRepository.findByDistrictIdAndActive(districtId);
    return entities.map((entity) => this.mapToDto(entity));
  }
}

