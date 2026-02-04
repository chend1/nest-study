import { PartialType } from '@nestjs/mapped-types';
import { CreateBrandDto } from './brand-create.dto';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {}
