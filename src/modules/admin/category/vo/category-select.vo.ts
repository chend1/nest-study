import { Expose, Type } from 'class-transformer';

export class CategorySelectVo {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() level: string;

  @Expose()
  @Type(() => CategorySelectVo)
  children?: CategorySelectVo[];
}
