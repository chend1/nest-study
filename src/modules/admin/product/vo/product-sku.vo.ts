import { Expose } from 'class-transformer';

export class ProductSkuVo {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  sku_code: string;

  @Expose()
  price: number;

  @Expose()
  stock: number;

  @Expose()
  status: number;
}
