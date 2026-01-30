import { Expose, Type } from 'class-transformer';
import { UserItemVo } from './user-item.vo';
import { RoleSimpleVo } from '../../role/vo/role-simple.vo';

export class UserInfoVo extends UserItemVo {
  @Expose()
  @Type(() => RoleSimpleVo) // 很关键
  roles: RoleSimpleVo[];

  @Expose() remark: string;
}
