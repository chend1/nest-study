import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
export class PermissionListQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  tree?: boolean;

  @IsOptional()
  @Transform(({ value }) => value && Number(value))
  type?: number;
}
