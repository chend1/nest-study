import { IntersectionType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { CreatePermissionDto } from './permission-create.dto';

export class RoleIdDto {
  @IsNotEmpty({
    message: 'id不能为空1',
  })
  id: string;
}

export class EditPermissionDto extends IntersectionType(
  RoleIdDto,
  CreatePermissionDto,
) {}
