import { Expose, Transform } from 'class-transformer';
import dayjs from 'dayjs';
export class ProductItemVo {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  brand_name: string;

  @Expose()
  brand_id: string;

  @Expose()
  category_name: string;

  @Expose()
  category_id: string;

  @Expose()
  status: number;

  @Expose()
  @Transform(({ value }) => Number(value))
  price: number;

  @Expose()
  @Transform(({ value }) => Number(value))
  stock: number;

  @Expose()
  @Transform(({ value }) => {
    return value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : null;
  })
  created_at: Date;
}
