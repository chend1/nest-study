import { IsOptional, IsString, IsInt, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryBrandDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : null))
  @IsInt()
  @IsIn([1, 2], { message: 'status 只能是 1启用 或 2禁用' })
  status?: number;
}
