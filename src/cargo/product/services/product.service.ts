import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { ProductResponseDto } from '../dto/product.dto';
import { ProductEntity } from '../repositories/product.repository.interface';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  private mapToDto(entity: ProductEntity): ProductResponseDto {
    return {
      id: entity.id,
      uuid: entity.uuid,
      productCode: entity.product_code,
      cargoId: entity.cargo_id,
      name: entity.name,
      description: entity.description,
      quantity: entity.quantity,
      unitValue: parseFloat(entity.unit_value.toString()),
      currencyId: entity.currency_id,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString(),
    };
  }

  async findAll(): Promise<ProductResponseDto[]> {
    const entities = await this.productRepository.findAll();
    return entities.map((entity) => this.mapToDto(entity));
  }

  async findById(id: number): Promise<ProductResponseDto> {
    const entity = await this.productRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByUuid(uuid: string): Promise<ProductResponseDto> {
    const entity = await this.productRepository.findByUuid(uuid);
    if (!entity) {
      throw new NotFoundException(`Product with uuid ${uuid} not found`);
    }
    return this.mapToDto(entity);
  }

  async findByProductCode(productCode: string): Promise<ProductResponseDto> {
    const entity = await this.productRepository.findByProductCode(productCode);
    if (!entity) {
      throw new NotFoundException(
        `Product with product code ${productCode} not found`,
      );
    }
    return this.mapToDto(entity);
  }

  async findByCargoId(cargoId: number): Promise<ProductResponseDto[]> {
    const entities = await this.productRepository.findByCargoId(cargoId);
    return entities.map((entity) => this.mapToDto(entity));
  }
}

