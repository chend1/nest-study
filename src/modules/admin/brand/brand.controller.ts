import { Controller, Get, Post, Query, Body, Param } from '@nestjs/common';
import { BrandService } from './brand.service';
// dto
import { CreateBrandDto } from './dto/brand-create.dto';
import { UpdateBrandDto } from './dto/brand-edit.dto';
import { QueryBrandDto } from './dto/brand-query.dto';
// vo
import { BrandInfoVo } from './vo/brand-info.vo';
import { BrandItemVo } from './vo/brand-item.vo';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}
  @Get('list')
  findAll(@Query() dto: QueryBrandDto) {
    return this.brandService.getBrandList(dto);
  }

  @Post('create')
  create(@Body() dto: CreateBrandDto) {
    return this.brandService.createBrand(dto);
  }

  @Post('edit/:id')
  edit(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
    return this.brandService.editBrand(id, dto);
  }

  @Post('del/:id')
  del(@Param('id') id: string) {
    return this.brandService.delBrand(id);
  }
}
