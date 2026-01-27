import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ nullable: true })
  remark: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date; // 创建时间

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date; // 更新时间

  // @ManyToMany(() => Permission)
  // @JoinTable({ name: 'role_permission' })
  // permissions: Permission[];
}
