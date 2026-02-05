import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  IsNotEmpty,
} from 'class-validator';

export class CreateProductSkuDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  sku_code: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  /** 1-启用 2-禁用 */
  @IsOptional()
  @IsInt()
  status?: number;
}
