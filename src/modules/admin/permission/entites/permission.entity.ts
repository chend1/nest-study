import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('permission')
export class Permission {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 100, unique: true })
  code: string;

  @Column({ type: 'tinyint' })
  type: number; // 1菜单 2接口 3按钮

  @Column({ nullable: true })
  parent_id: string;

  @Column({ nullable: true })
  path: string;

  @Column({ nullable: true })
  method: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ default: 30 })
  sort: number;
}
