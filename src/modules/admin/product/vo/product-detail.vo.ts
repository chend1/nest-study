import { Expose, Type } from 'class-transformer';
import { ProductSkuVo } from './product-sku.vo';

export class ProductDetailVo {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  category_id: string;

  @Expose()
  brand_id: string;

  @Expose()
  cover: string | null;

  @Expose()
  images: string[] | null;

  @Expose()
  summary: string | null;

  @Expose()
  description: string | null;

  @Expose()
  status: number;

  @Expose()
  sort: number;

  @Expose()
  @Type(() => ProductSkuVo)
  skus: ProductSkuVo[];
}
