import { Expose, Type } from 'class-transformer';

export class CategoryTreeVo {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() parent_id: string;
  @Expose() level: number;
  @Expose() sort: number;
  @Expose() status: number;

  @Expose()
  @Type(() => CategoryTreeVo)
  children: CategoryTreeVo[];
}
