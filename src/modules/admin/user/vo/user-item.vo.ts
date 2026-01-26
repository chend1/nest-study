import { Expose, Transform } from 'class-transformer';
import dayjs from 'dayjs';

export class UserItemVo {
  @Expose() id: number;

  @Expose() account: number;

  @Expose() name: string;

  @Expose() email: string;

  @Expose() phone: string;

  @Expose() avatar: string;

  @Expose() status: number;

  @Expose() remark: string;

  @Expose() lastLoginIp: string;

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
