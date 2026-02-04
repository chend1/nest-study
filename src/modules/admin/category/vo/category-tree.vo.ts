import { Expose, Type } from 'class-transformer';
import { CategoryItemVo } from './category-item.vo';

export class CategoryTreeVo extends CategoryItemVo {
  @Expose()
  @Type(() => CategoryTreeVo)
  children?: CategoryTreeVo[];
}
