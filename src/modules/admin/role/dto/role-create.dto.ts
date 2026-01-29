import { IsNotEmpty, IsString, Length, IsOptional } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({
    message: '角色名不能为空',
  })
  @Length(2, 20, {
    message: '角色名长度为2-20位',
  })
  name: string;

  @IsNotEmpty({
    message: '角色编码不能为空',
  })
  @Length(2, 20, {
    message: '角色编码长度为2-20位',
  })
  code: string;

  @IsOptional()
  @IsString({
    message: '描述必须是字符串',
  })
  remark?: string;
}
