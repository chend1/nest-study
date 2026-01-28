import {
  IsNotEmpty,
  IsString,
  MinLength,
  Length,
  IsNumber,
} from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty({
    message: '权限名不能为空',
  })
  @Length(2, 20, {
    message: '权限名长度为2-20位',
  })
  name: string;

  @Length(2, 20, {
    message: '权限编码长度为2-20位',
  })
  code: string;

  @IsNumber()
  type: number;

  @IsString()
  parent_id: string;

  @IsString({
    message: '描述必须是字符串',
  })
  remark: string;

  @IsString({
    message: '路径必须是字符串',
  })
  path: string;

  @IsString({
    message: '方法名必须是字符串',
  })
  method: string;
}
