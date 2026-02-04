import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
// dto
import { CreateCategoryDto } from './dto/category-create.dto';
import { CategoryEditDto } from './dto/category-edit.dto';
import { CategoryIdDto } from './dto/category-id.dto';
import { CategoryQueryDto } from './dto/category-query.dto';
// vo
import { CategoryItemVo } from './vo/category-item.vo';
import { CategoryTreeVo } from './vo/category-tree.vo';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Post('update/:id')
  edit(@Param('id') id: string, @Body() dto: CategoryEditDto) {}

  @Get('list')
  list(@Query() dto: CategoryQueryDto): Promise<CategoryItemVo[]> {
    return this.categoryService.getList(dto);
  }

  @Post('del/:id')
  delete(@Query('id') id: string) {
    return this.categoryService.delete(id);
  }

  @Get('tree')
  treeList(
    @Query() dto: Pick<CategoryQueryDto, 'status'>,
  ): Promise<CategoryTreeVo[]> {
    return this.categoryService.getTree(dto);
  }
}
