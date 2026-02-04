import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { PermissionType } from '../enum/permission-type.enum';

@Entity('permission')
export class Permission {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 100, unique: true, nullable: true })
  code: string;

  @Column({ type: 'tinyint' })
  type: PermissionType;

  @Index()
  @Column({ nullable: true })
  parent_id: string;

  @ManyToOne(() => Permission)
  @JoinColumn({ name: 'parent_id' })
  parent: Permission;

  @Column({ nullable: true })
  path: string;

  @Column({ nullable: true })
  method: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ default: 30 })
  sort: number;

  @Column({ default: 1 })
  is_show: number; // 1显示 0不显示
}
