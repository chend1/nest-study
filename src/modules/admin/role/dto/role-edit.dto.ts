import { OmitType, IntersectionType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { CreateRoleDto } from './role-create.dto';

export class RoleIdDto {
  @IsNotEmpty({
    message: 'id不能为空',
  })
  id: string;
}

export class EditRoleDto extends IntersectionType(
  RoleIdDto,
  OmitType(CreateRoleDto, ['code']),
) {}
