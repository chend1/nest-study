import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './category-create.dto';
import { CategoryIdDto } from './category-id.dto';

export class CategoryEditDto extends IntersectionType(
  PartialType(CreateCategoryDto),
  CategoryIdDto,
) {}
