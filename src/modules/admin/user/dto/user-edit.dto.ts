import { OmitType, IntersectionType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { CreateUserDto } from './user-create.dto';

class UserIdDto {
  @IsNotEmpty({
    message: 'id不能为空',
  })
  id: string;
}
export class EditUserDto extends IntersectionType(
  OmitType(CreateUserDto, ['account', 'password']),
  UserIdDto,
) {}
