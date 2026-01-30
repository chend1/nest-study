import { IsNotEmpty } from 'class-validator';

export class UserIdDto {
  @IsNotEmpty({
    message: 'id不能为空',
  })
  id: string;
}
