import { UserItemVo } from './user-item.vo';

export class UserListVo {
  list: UserItemVo[];
  total: number;
  page: number;
  size: number;
}
