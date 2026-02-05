import { Controller, Get, Query, Param, Body, Post } from '@nestjs/common';
import { ProductService } from './product.service';
// dto
import { CreateProductDto } from './dto/product-create.dto';
import { UpdateProductDto } from './dto/product-edit.dto';
import { QueryProductDto } from './dto/product-query.dto';
// vo
import { ProductDetailVo } from './vo/product-detail.vo';
import { ProductListVo } from './vo/product-list.vo';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('list')
  findAll(@Query() dto: QueryProductDto) {
    return this.productService.getProductList(dto);
  }

  @Get('detail/:id')
  findDetail(@Param('id') id: string) {
    return this.productService.getDetail(id);
  }

  @Post('add')
  create(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }

  @Post('edit/:id')
  edit(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.editProduct(id, dto);
  }

  @Post('del/:id')
  del(@Param('id') id: string) {
    return this.productService.delProduct(id);
  }
}
