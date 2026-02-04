import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 50, unique: true })
  account: string; // 账号

  @Column({ length: 100 })
  password: string; // 密码

  @Column({ length: 50, nullable: true })
  name: string; // 姓名

  @Column({ length: 100, nullable: true, unique: true })
  email: string; // 邮箱

  @Column({ length: 11 })
  phone: string; // 手机号

  @Column({ length: 255, nullable: true })
  avatar: string; // 头像

  @Column({ type: 'tinyint', default: 1 })
  status: number; // 状态: 1启用 2禁用

  @Column({ type: 'tinyint', default: 1 })
  type: number; // 账号类型: 1普通 2后台

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date; // 创建时间

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date; // 更新时间
}
