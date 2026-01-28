import { Expose, Transform } from 'class-transformer';
import dayjs from 'dayjs';

export class PermissionItemVo {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() code: string;
  @Expose() path: string;
  @Expose() method: string;
  @Expose() type: number;
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
  children: PermissionItemVo[] = [];
}
