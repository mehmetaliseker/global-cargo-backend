import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerNoteRepository } from '../repositories/customer-note.repository';
import { CustomerNoteResponseDto } from '../dto/customer-note.dto';
import { CustomerNoteEntity } from '../repositories/customer-note.repository.interface';

@Injectable()
export class CustomerNoteService {
  constructor(
    private readonly customerNoteRepository: CustomerNoteRepository,
  ) {}

  private mapToDto(entity: CustomerNoteEntity): CustomerNoteResponseDto {
    return {
      id: entity.id,
      customerId: entity.customer_id,
      noteText: entity.note_text,
      noteType: entity.note_type,
      createdBy: entity.created_by ?? undefined,
      isPrivate: entity.is_private,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<CustomerNoteResponseDto[]> {
    const entities = await this.customerNoteRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<CustomerNoteResponseDto> {
    const entity = await this.customerNoteRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Customer note with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByCustomerId(
    customerId: number,
  ): Promise<CustomerNoteResponseDto[]> {
    const entities = await this.customerNoteRepository.findByCustomerId(
      customerId,
    );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByNoteType(noteType: string): Promise<CustomerNoteResponseDto[]> {
    const entities = await this.customerNoteRepository.findByNoteType(noteType);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCreatedBy(createdBy: number): Promise<CustomerNoteResponseDto[]> {
    const entities = await this.customerNoteRepository.findByCreatedBy(
      createdBy,
    );
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findPublic(): Promise<CustomerNoteResponseDto[]> {
    const entities = await this.customerNoteRepository.findPublic();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findPrivate(): Promise<CustomerNoteResponseDto[]> {
    const entities = await this.customerNoteRepository.findPrivate();
    return entities.map((entity) => this.mapToDto(entity));
  }
}
