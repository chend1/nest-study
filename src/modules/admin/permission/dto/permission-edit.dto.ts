import { IntersectionType, OmitType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { CreatePermissionDto } from './permission-create.dto';

export class PermissionIdDto {
  @IsNotEmpty({
    message: 'id不能为空',
  })
  id: string;

  @IsOptional()
  @Length(2, 20, { message: '权限编码长度为2-20位' })
  code: string;

  @IsOptional()
  @Length(2, 20, { message: '权限名长度为2-20位' })
  name: string;
}

export class EditPermissionDto extends IntersectionType(
  PermissionIdDto,
  OmitType(CreatePermissionDto, ['type']),
) {}
