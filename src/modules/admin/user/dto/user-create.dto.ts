// dto/create-account.dto.ts
import {
  IsNotEmpty,
  IsString,
  MinLength,
  Length,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({
    message: '账号不能为空',
  })
  @Length(5, 11, {
    message: '账号长度为5-11位',
  })
  account: string;

  @IsOptional()
  @IsString({
    message: '密码必须是字符串',
  })
  @MinLength(6, {
    message: '密码长度不能小于6位',
  })
  password: string;

  @IsNotEmpty({
    message: '用户名不能为空',
  })
  @IsString({
    message: '用户名必须是字符串',
  })
  name: string;

  @IsOptional()
  @IsString({
    message: '邮箱必须是字符串',
  })
  email?: string;

  @IsOptional()
  @Length(11, 11, {
    message: '手机号必须是11位',
  })
  phone?: string;

  @IsOptional()
  @IsString({
    message: '头像必须是字符串',
  })
  avatar?: string;

  @IsOptional()
  @IsIn([1, 2, 3])
  status?: number;

  @IsOptional()
  @IsString({
    message: '备注必须是字符串',
  })
  remark?: string;
}
