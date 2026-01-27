import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('admin_user')
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
  status: number; // 状态: 1启用 2禁用 3锁定

  @Column({ length: 255, nullable: true })
  remark: string; // 备注

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date; // 创建时间

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date; // 更新时间

  @Column({ length: 50, nullable: true })
  last_login_ip: string; // 最后登录ip

  @UpdateDateColumn({ name: 'last_login_at' })
  last_login_at: Date; // 最后登录时间

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date; // 删除时间
}
