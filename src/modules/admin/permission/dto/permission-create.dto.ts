import {
  IsNotEmpty,
  IsString,
  Length,
  IsNumber,
  IsOptional,
  IsIn,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePermissionDto {
  @IsNotEmpty({ message: '权限名不能为空' })
  @Length(2, 20, { message: '权限名长度为2-20位' })
  name: string;

  @Length(2, 20, { message: '权限编码长度为2-20位' })
  code: string;

  @IsNumber({}, { message: '类型必须是数字' })
  @IsIn([1, 2, 3], { message: '类型只能是 1 / 2 / 3' })
  type: number;

  @IsNumber({}, { message: '排序必须是数字' })
  sort: number;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsString({ message: '父级ID必须是字符串' })
  parent_id?: string;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsString({ message: '描述必须是字符串' })
  remark?: string;

  @IsString({ message: '路径必须是字符串' })
  path: string;

  @IsString({ message: '方法名必须是字符串' })
  method: string;
}
