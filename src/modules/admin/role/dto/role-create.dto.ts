import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: '角色名称不能为空' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: '角色编码不能为空' })
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  remark?: string;

  @IsOptional()
  @IsNumber({}, { message: '排序必须是数字' })
  sort?: number;

  @IsOptional()
  @IsNumber({}, { message: '状态必须是数字' })
  status?: number;
}
