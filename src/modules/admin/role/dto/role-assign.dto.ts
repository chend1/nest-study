import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AssignRolePermissionDto {
  @IsString()
  @IsNotEmpty({ message: '角色ID不能为空' })
  role_id: string;

  @IsArray({ message: '权限ID必须是数组' })
  permission_ids: string[];
}
