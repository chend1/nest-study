import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './role-create.dto';

export class UpdateRoleDto extends PartialType(
  OmitType(CreateRoleDto, ['code']),
) {}
