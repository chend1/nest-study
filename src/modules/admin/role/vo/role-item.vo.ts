import { Expose } from 'class-transformer';

export class RoleItemVo {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  code: string;

  @Expose()
  status: number;

  @Expose()
  sort: number;

  @Expose()
  remark: string;

  @Expose()
  created_at: Date;
}
