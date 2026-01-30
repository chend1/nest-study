import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: '分类名称不能为空' })
  @IsString()
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsInt()
  parent_id?: string; // 默认 0 / null

  @IsOptional()
  @IsInt()
  sort?: number;

  @IsOptional()
  @IsInt()
  status?: number; // 1 启用 2 禁用

  @IsOptional()
  @IsString()
  @MaxLength(200)
  remark?: string;
}
