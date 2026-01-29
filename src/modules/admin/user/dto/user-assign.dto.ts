import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AssignUserRoleDto {
  @IsString()
  @IsNotEmpty({ message: '用户ID不能为空' })
  user_id: string;

  @IsArray({ message: '角色ID必须是数组' })
  role_ids: string[];
}
