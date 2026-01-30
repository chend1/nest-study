import { Expose } from 'class-transformer';

export class AdminRoleVo {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  name: string;
}
