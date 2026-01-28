import { IntersectionType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { CreatePermissionDto } from './permission-create.dto';

export class PermissionIdDto {
  @IsNotEmpty({
    message: 'id不能为空',
  })
  id: string;
}

export class EditPermissionDto extends IntersectionType(
  PermissionIdDto,
  CreatePermissionDto,
) {}
