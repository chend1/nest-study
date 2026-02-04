import { Expose, Transform } from 'class-transformer';
import dayjs from 'dayjs';

export class BrandItemVo {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  logo?: string;

  @Expose()
  status: number;

  @Expose()
  @Transform(({ value }) => {
    return value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : null;
  })
  created_at: Date;

  @Expose()
  @Transform(({ value }) => {
    return value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : null;
  })
  updated_at: Date;
}
