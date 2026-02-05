import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Product } from './product.entity';

@Entity('product_sku')
export class ProductSku {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'bigint' })
  product_id: string;

  @ManyToOne(() => Product, (product) => product.skus)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  /** SKU 名称：黑色 128G */
  @Column({ length: 200 })
  name: string;

  @Column({ length: 100, unique: true })
  sku_code: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'tinyint', default: 1 })
  status: number;
}
