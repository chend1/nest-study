import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PermissionType } from '../enum/permission-type.enum';

export class CreatePermissionDto {
  @IsNotEmpty({ message: '权限名称不能为空' })
  @IsString()
  @MaxLength(50)
  name: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @IsString()
  @MaxLength(100)
  code?: string; // type=BUTTON 时必填，可在 service 层校验

  @IsNotEmpty({ message: '权限类型不能为空' })
  @IsEnum(PermissionType, { message: '权限类型不合法，只能是0、1、2、3' })
  type: PermissionType;

  @IsOptional()
  @IsNumber()
  parent_id?: string;

  @IsOptional()
  @IsString()
  path?: string;

  @IsOptional()
  @IsString()
  method?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsNumber()
  sort?: number;

  @IsOptional()
  @IsNumber()
  is_show?: number;
}
