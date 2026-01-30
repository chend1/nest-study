import { Expose, Type } from 'class-transformer';
import { RoleSimpleVo } from '../../role/vo/role-simple.vo';
import { PermissionTreeVo } from '../../permission/vo/permission-tree.vo';

export class LoginUserVo {
  @Expose() id: string;

  @Expose() account: string;

  @Expose() name: string;

  @Expose() avatar: string;

  @Expose()
  @Type(() => RoleSimpleVo) //  很关键
  roles: RoleSimpleVo[];

  @Expose()
  permissions: string[];

  @Expose()
  menus: PermissionTreeVo[];
}
