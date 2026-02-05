import { ProductItemVo } from './product-item.vo';

export class ProductListVo {
  list: ProductItemVo[];
  total: number;
  page: number;
  size: number;
}
