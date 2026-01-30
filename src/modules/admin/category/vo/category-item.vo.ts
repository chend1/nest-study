import { Expose } from 'class-transformer';

export class CategoryItemVo {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() parent_id: string;
  @Expose() level: number;
  @Expose() sort: number;
  @Expose() status: number;
  @Expose() remark: string;
  @Expose() created_at: string;
  @Expose() updated_at: string;
}
