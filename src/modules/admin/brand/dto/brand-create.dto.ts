import {
  IsString,
  IsOptional,
  MaxLength,
  IsInt,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBrandDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  logo?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  status?: number; // 1启用 2禁用

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  sort?: number;

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  categoryIds?: number[]; // 关联的分类ID
}
