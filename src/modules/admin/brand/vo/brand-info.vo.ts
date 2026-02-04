import { Expose, Type } from 'class-transformer';

class BrandCategoryVo {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

class BrandProductVo {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

export class BrandInfoVo {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  logo?: string;

  @Expose()
  status: number;

  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => BrandCategoryVo)
  categories?: BrandCategoryVo[];

  @Expose()
  @Type(() => BrandProductVo)
  products?: BrandProductVo[];
}
