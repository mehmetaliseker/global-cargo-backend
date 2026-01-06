import {
  IsString,
  IsNumber,
  IsUUID,
  IsOptional,
  Min,
} from 'class-validator';

export class ProductResponseDto {
  @IsNumber()
  id: number;

  @IsUUID()
  uuid: string;

  @IsString()
  productCode: string;

  @IsNumber()
  cargoId: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  unitValue: number;

  @IsNumber()
  currencyId: number;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  deletedAt?: string;
}

