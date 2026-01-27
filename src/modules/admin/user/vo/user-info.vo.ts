import { Expose } from 'class-transformer';
import { UserItemVo } from './user-item.vo';

export class UserInfoVo extends UserItemVo {
  @Expose() remark: string;
}
