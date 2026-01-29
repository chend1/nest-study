import { Expose, Type } from 'class-transformer';
import { UserItemVo } from './user-item.vo';
import { RoleSimpleVo } from '../../role/vo/role-item.vo';
import { PermissionSimpleVo } from '../../permission/vo/permission-item.vo';

export class UserInfoVo extends UserItemVo {
  @Expose()
  @Type(() => RoleSimpleVo) // ✅ 很关键
  roles: RoleSimpleVo[];

  @Expose() remark: string;
}

export class UserLoginInfoVo {
  @Expose() id: string;
  @Expose() account: string;
  @Expose() name: string;
  @Expose() avatar: string;
  @Expose()
  @Type(() => RoleSimpleVo) // ✅ 很关键
  roles: RoleSimpleVo[];

  @Expose()
  permissions: string[];

  @Expose()
  menus: PermissionSimpleVo[];
}
