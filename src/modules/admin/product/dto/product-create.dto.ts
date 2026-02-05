import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProductSkuDto } from './product-sku-create.dto';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  code?: string;

  @IsNotEmpty()
  @IsString()
  category_id: string;

  @IsNotEmpty()
  @IsString()
  brand_id: string;

  @IsOptional()
  @IsString()
  cover?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  description?: string;

  /** 1-上架 2-下架 */
  @IsOptional()
  @IsInt()
  status?: number;

  @IsOptional()
  @IsInt()
  sort?: number;

  /** SKU 列表 */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductSkuDto)
  skus: CreateProductSkuDto[];
}
