import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { Brand } from 'src/modules/admin/brand/entities/brand.entity';
import { Category } from 'src/modules/admin/category/entities/category.entity';
// import { ProductSku } from './product-sku.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  /** 产品名称（SPU 名称） */
  @Index()
  @Column({ length: 200 })
  name: string;

  /** 产品编码（可选，用于内部管理） */
  @Index({ unique: true })
  @Column({ length: 100, nullable: true })
  code: string | null;

  /** 分类 */
  @Index()
  @Column({ type: 'bigint' })
  category_id: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  /** 品牌 */
  @Index()
  @Column({ type: 'bigint' })
  brand_id: string;

  @ManyToOne(() => Brand)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  /** 产品主图 */
  @Column({ length: 500, nullable: true })
  cover: string | null;

  /** 产品图集 */
  @Column({ type: 'json', nullable: true })
  images: string[] | null;

  /** 简介 */
  @Column({ length: 500, nullable: true })
  summary: string | null;

  /** 详情（富文本） */
  @Column({ type: 'text', nullable: true })
  description: string | null;

  /** 状态：1-上架 2-下架 */
  @Index()
  @Column({ type: 'tinyint', default: 1 })
  status: number;

  /** 排序 */
  @Column({ type: 'int', default: 0 })
  sort: number;

  /** SKU 列表 */
  // @OneToMany(() => ProductSku, sku => sku.product)
  // skus: ProductSku[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
