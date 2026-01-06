export interface ProductEntity {
  id: number;
  uuid: string;
  product_code: string;
  cargo_id: number;
  name: string;
  description?: string;
  quantity: number;
  unit_value: number;
  currency_id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface IProductRepository {
  findAll(): Promise<ProductEntity[]>;
  findById(id: number): Promise<ProductEntity | null>;
  findByUuid(uuid: string): Promise<ProductEntity | null>;
  findByProductCode(productCode: string): Promise<ProductEntity | null>;
  findByCargoId(cargoId: number): Promise<ProductEntity[]>;
}

