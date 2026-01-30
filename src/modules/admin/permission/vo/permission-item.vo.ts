import { Expose, Transform } from 'class-transformer';
import dayjs from 'dayjs';

export class PermissionItemVo {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  code: string;

  @Expose()
  type: number; // 1菜单 2接口 3按钮

  @Expose()
  parent_id: string | null;

  @Expose()
  path: string | null;

  @Expose()
  method: string | null;

  @Expose()
  icon: string | null;

  @Expose()
  sort: number;
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
