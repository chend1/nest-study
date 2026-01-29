import { OmitType, IntersectionType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { CreateRoleDto } from './role-create.dto';

export class RoleIdDto {
  @IsNotEmpty({
    message: 'id不能为空',
  })
  id: string;
}

export class EditRoleDto extends IntersectionType(
  OmitType(CreateRoleDto, ['code']),
  RoleIdDto,
) {}
