import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
// dto
import { CreateCategoryDto } from './dto/category-create.dto';
import { CategoryEditDto } from './dto/category-edit.dto';
import { CategoryIdDto } from './dto/category-id.dto';
import { CategoryQueryDto } from './dto/category-query.dto';
// vo

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  create(@Body() dto: CreateCategoryDto) {}

  @Post('edit')
  edit(@Body() dto: CategoryEditDto) {}

  @Get('list')
  list(@Query() dto: CategoryQueryDto) {}

  // @Get('tree')
  // tree(): Promise<CategoryTreeVo[]> {}
}
