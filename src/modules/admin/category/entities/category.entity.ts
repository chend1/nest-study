import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Index()
  @Column({ type: 'bigint', nullable: true })
  parent_id: string | null;

  @Column({ type: 'varchar', length: 255 })
  path: string; // 例如：/1/2/3

  @Column({ type: 'int' })
  level: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'int', default: 0 })
  sort: number;

  @Column({ type: 'int', default: 1 })
  status: number; // 1启用 2禁用

  @Column({ type: 'varchar', length: 255, nullable: true })
  remark: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
