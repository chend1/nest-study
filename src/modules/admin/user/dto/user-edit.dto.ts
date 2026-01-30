import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './user-create.dto';

export class EditUserDto extends PartialType(
  OmitType(CreateUserDto, ['account', 'password'] as const),
) {}
