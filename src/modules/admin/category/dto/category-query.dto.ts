import { IsOptional, IsString, IsInt } from 'class-validator';

export class CategoryQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  status?: number;
}
