import { IsNotEmpty, IsString } from 'class-validator';

export class CategoryIdDto {
  @IsNotEmpty({ message: 'id不能为空' })
  @IsString({ message: 'id必须是字符串' })
  id: string;
}
