import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
} from 'typeorm';

@Entity('user_address')
export class UserAddress {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  userId: number; // 用户ID

  @Column({ length: 50 })
  receiver: string; // 收件人

  @Column({ length: 20 })
  phone: string; // 联系电话

  @Column({ length: 20 })
  tag: string; // 地址标签

  @Column({ length: 50, nullable: true })
  province: string; // 省

  @Column({ length: 50, nullable: true })
  city: string; // 市

  @Column({ length: 50, nullable: true })
  district: string; // 区

  @Column({ length: 255, nullable: true })
  detail: string; // 详细地址

  @Column({ type: 'tinyint', default: 0 })
  is_default: number; // 是否默认

  @DeleteDateColumn()
  deleted_at: Date;
}
