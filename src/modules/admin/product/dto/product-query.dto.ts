import { IsInt, IsOptional, IsString, Min, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  category_id?: string;

  @IsOptional()
  @IsString()
  brand_id?: string;

  /** 1-上架 2-下架 */
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : null))
  @IsInt()
  @IsIn([1, 2], { message: 'status 只能是 1上架 或 2下架' })
  status?: number;

  @Transform(({ value }) => Number(value || 1))
  @IsInt()
  @Min(1)
  page: number = 1;

  @Transform(({ value }) => Number(value || 10))
  @IsInt()
  @Min(1)
  size: number = 10;
}
