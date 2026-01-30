import { PermissionItemVo } from './permission-item.vo';
import { Expose, Type } from 'class-transformer';

export class PermissionTreeVo extends PermissionItemVo {
  @Expose()
  @Type(() => PermissionTreeVo)
  children?: PermissionTreeVo[];
}
