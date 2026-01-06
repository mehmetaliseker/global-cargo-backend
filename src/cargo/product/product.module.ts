import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ProductRepository } from './repositories/product.repository';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductController],
  providers: [ProductRepository, ProductService],
  exports: [ProductService, ProductRepository],
})
export class ProductModule {}

