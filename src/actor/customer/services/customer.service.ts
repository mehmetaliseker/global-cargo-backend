import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerRepository } from '../repositories/customer.repository';
import { CustomerResponseDto } from '../dto/customer.dto';
import { CustomerEntity } from '../repositories/customer.repository.interface';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  private mapToDto(entity: CustomerEntity): CustomerResponseDto {
    return {
      id: entity.id,
      uuid: entity.uuid,
      actorId: entity.actor_id,
      firstName: entity.first_name,
      lastName: entity.last_name,
      identityNumber: entity.identity_number,
      countryId: entity.country_id,
      registrationDate: entity.registration_date.toISOString(),
      isVerified: entity.is_verified,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<CustomerResponseDto[]> {
    const entities = await this.customerRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<CustomerResponseDto> {
    const entity = await this.customerRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<CustomerResponseDto> {
    const entity = await this.customerRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(`Customer with uuid ${uuid} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByActorId(actorId: number): Promise<CustomerResponseDto> {
    const entity = await this.customerRepository.findByActorId(actorId);
    if (!entity) {
      throw new NotFoundException(
        `Customer with actor id ${actorId} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByCountryId(countryId: number): Promise<CustomerResponseDto[]> {
    const entities = await this.customerRepository.findByCountryId(countryId);
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findVerified(): Promise<CustomerResponseDto[]> {
    const entities = await this.customerRepository.findVerified();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findByCountryIdAndVerified(
    countryId: number,
  ): Promise<CustomerResponseDto[]> {
    const entities =
      await this.customerRepository.findByCountryIdAndVerified(countryId);
    return entities.map((entity) => this.mapToDto(entity));
  }
}

