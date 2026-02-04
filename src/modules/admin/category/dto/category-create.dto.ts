import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: '分类名称不能为空' })
  @IsString({
    message: '分类名称必须是字符串',
  })
  @MaxLength(50)
  name: string;

  @IsOptional()
  parent_id?: string; // 默认 0 / null

  @IsOptional()
  @IsInt({ message: '排序必须是数字' })
  sort?: number;

  @IsOptional()
  @IsInt()
  status?: number; // 1 启用 2 禁用

  @IsOptional()
  @IsString({
    message: '备注必须是字符串',
  })
  @MaxLength(200)
  remark?: string;
}
