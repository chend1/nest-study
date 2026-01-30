import { Expose, Type } from 'class-transformer';

export class CategorySelectVo {
  @Expose() value: string;
  @Expose() label: string;

  @Expose()
  @Type(() => CategorySelectVo)
  children?: CategorySelectVo[];
}
