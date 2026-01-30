import { Expose, Type } from 'class-transformer';
import { PermissionItemVo } from '../../permission/vo/permission-item.vo';

export class RoleDetailVo {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  code: string;

  @Expose()
  status: number;

  @Expose()
  remark: string;

  @Expose()
  @Type(() => PermissionItemVo)
  permissions: PermissionItemVo[];
}
