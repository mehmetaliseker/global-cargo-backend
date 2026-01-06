import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { ProductResponseDto } from '../dto/product.dto';

@Controller('cargo/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(): Promise<ProductResponseDto[]> {
    return await this.productService.findAll();
  }

  @Get('cargo/:cargoId')
  async findByCargoId(
    @Param('cargoId', ParseIntPipe) cargoId: number,
  ): Promise<ProductResponseDto[]> {
    return await this.productService.findByCargoId(cargoId);
  }

  @Get('product-code/:productCode')
  async findByProductCode(
    @Param('productCode') productCode: string,
  ): Promise<ProductResponseDto> {
    return await this.productService.findByProductCode(productCode);
  }

  @Get('uuid/:uuid')
  async findByUuid(@Param('uuid') uuid: string): Promise<ProductResponseDto> {
    return await this.productService.findByUuid(uuid);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductResponseDto> {
    return await this.productService.findById(id);
  }
}

