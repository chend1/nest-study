import { Expose } from 'class-transformer';
import dayjs from 'dayjs';
import { Transform } from 'class-transformer';

export class CategoryItemVo {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() parent_id: string;
  @Expose() level: number;
  @Expose() path: string;
  @Expose() sort: number;
  @Expose() status: number;
  @Expose() remark: string;
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
