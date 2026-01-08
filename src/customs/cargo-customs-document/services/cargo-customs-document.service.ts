import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CargoCustomsDocumentRepository } from '../repositories/cargo-customs-document.repository';
import {
  CargoCustomsDocumentResponseDto,
  CreateCargoCustomsDocumentDto,
  UpdateCargoCustomsDocumentDto,
  VerifyCargoCustomsDocumentDto,
} from '../dto/cargo-customs-document.dto';
import { CargoCustomsDocumentEntity } from '../repositories/cargo-customs-document.repository.interface';

@Injectable()
export class CargoCustomsDocumentService {
  constructor(
    private readonly cargoCustomsDocumentRepository: CargoCustomsDocumentRepository,
  ) {}

  private mapToDto(
    entity: CargoCustomsDocumentEntity,
  ): CargoCustomsDocumentResponseDto {
    let documentData: Record<string, unknown> | undefined;
    if (entity.document_data) {
      if (typeof entity.document_data === 'string') {
        documentData = JSON.parse(entity.document_data);
      } else {
        documentData = entity.document_data as Record<string, unknown>;
      }
    }

    return {
      id: entity.id,
      cargoId: entity.cargo_id,
      customsDocumentTypeId: entity.customs_document_type_id,
      documentNumber: entity.document_number ?? undefined,
      documentData,
      fileReference: entity.file_reference ?? undefined,
      issueDate: entity.issue_date?.toISOString(),
      expiryDate: entity.expiry_date?.toISOString(),
      isVerified: entity.is_verified,
      verifiedBy: entity.verified_by ?? undefined,
      verifiedAt: entity.verified_at?.toISOString(),
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<CargoCustomsDocumentResponseDto[]> {
    const entities =
      await this.cargoCustomsDocumentRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<CargoCustomsDocumentResponseDto> {
    const entity = await this.cargoCustomsDocumentRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `Cargo customs document with id ${id} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByCargoId(
    cargoId: number,
  ): Promise<CargoCustomsDocumentResponseDto[]> {
    const entities =
      await this.cargoCustomsDocumentRepository.findByCargoId(cargoId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCargoIdAndDocumentTypeId(
    cargoId: number,
    documentTypeId: number,
  ): Promise<CargoCustomsDocumentResponseDto | null> {
    const entity =
      await this.cargoCustomsDocumentRepository.findByCargoIdAndDocumentTypeId(
        cargoId,
        documentTypeId,
      );
    if (!entity) {
      return null;
    }
    return this.mapToDto(entity);
  }

  async findByDocumentTypeId(
    documentTypeId: number,
  ): Promise<CargoCustomsDocumentResponseDto[]> {
    const entities =
      await this.cargoCustomsDocumentRepository.findByDocumentTypeId(
        documentTypeId,
      );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByVerified(verified: boolean): Promise<CargoCustomsDocumentResponseDto[]> {
    const entities =
      await this.cargoCustomsDocumentRepository.findByVerified(verified);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async create(
    createDto: CreateCargoCustomsDocumentDto,
  ): Promise<CargoCustomsDocumentResponseDto> {
    if (createDto.expiryDate && createDto.issueDate) {
      const expiry = new Date(createDto.expiryDate);
      const issue = new Date(createDto.issueDate);
      if (expiry < issue) {
        throw new BadRequestException(
          'Expiry date cannot be before issue date',
        );
      }
    }

    const entity = await this.cargoCustomsDocumentRepository.create(
      createDto.cargoId,
      createDto.customsDocumentTypeId,
      createDto.documentNumber ?? null,
      createDto.documentData ?? null,
      createDto.fileReference ?? null,
      createDto.issueDate ? new Date(createDto.issueDate) : null,
      createDto.expiryDate ? new Date(createDto.expiryDate) : null,
    );

    return this.mapToDto(entity);
  }

  async update(
    id: number,
    updateDto: UpdateCargoCustomsDocumentDto,
  ): Promise<CargoCustomsDocumentResponseDto> {
    const existing = await this.cargoCustomsDocumentRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(
        `Cargo customs document with id ${id} not found`,
      );
    }

    if (existing.is_verified) {
      throw new BadRequestException(
        'Cannot update verified customs document',
      );
    }

    if (updateDto.expiryDate && updateDto.issueDate) {
      const expiry = new Date(updateDto.expiryDate);
      const issue = new Date(updateDto.issueDate);
      if (expiry < issue) {
        throw new BadRequestException(
          'Expiry date cannot be before issue date',
        );
      }
    }

    const entity = await this.cargoCustomsDocumentRepository.update(
      id,
      updateDto.documentNumber ?? null,
      updateDto.documentData ?? null,
      updateDto.fileReference ?? null,
      updateDto.issueDate ? new Date(updateDto.issueDate) : null,
      updateDto.expiryDate ? new Date(updateDto.expiryDate) : null,
    );

    return this.mapToDto(entity);
  }

  async verify(
    id: number,
    verifyDto: VerifyCargoCustomsDocumentDto,
  ): Promise<CargoCustomsDocumentResponseDto> {
    const existing = await this.cargoCustomsDocumentRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(
        `Cargo customs document with id ${id} not found`,
      );
    }

    if (existing.is_verified) {
      throw new BadRequestException(
        'Customs document is already verified',
      );
    }

    const entity = await this.cargoCustomsDocumentRepository.verify(
      id,
      verifyDto.verifiedBy,
    );

    return this.mapToDto(entity);
  }

  async delete(id: number): Promise<void> {
    const existing = await this.cargoCustomsDocumentRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(
        `Cargo customs document with id ${id} not found`,
      );
    }

    if (existing.is_verified) {
      throw new BadRequestException(
        'Cannot delete verified customs document',
      );
    }

    await this.cargoCustomsDocumentRepository.softDelete(id);
  }
}

