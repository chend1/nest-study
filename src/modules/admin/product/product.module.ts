import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
// 实体
import { Product } from './entities/product.entity';
import { ProductSku } from './entities/product-sku.entity';
import { Category } from '../category/entities/category.entity';
import { Brand } from '../brand/entities/brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductSku, Category, Brand])],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
