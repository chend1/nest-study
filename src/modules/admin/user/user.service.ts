import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entites/user.entity';
import { UserListDto } from './dto/user-list.dto';
import { CreateUserDto } from './dto/user-create.dto';
import { EditUserDto } from './dto/user-edit.dto';
import { UserListVo } from './vo/user-list.vo';
import { UserItemVo } from './vo/user-item.vo';
import { UserInfoVo } from './vo/user-info.vo';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}
  // 获取用户列表
  async getUserList(params: UserListDto): Promise<UserListVo> {
    const { page, size, name } = params;
    const where = name ? { name: Like(`%${name}%`) } : {};
    const [list, total] = await this.userRepo.findAndCount({
      where,
      skip: (page - 1) * size,
      take: size,
    });
    return {
      list: plainToInstance(UserItemVo, list),
      total,
      page,
      size,
    };
  }

  // 获取用户详情
  async getUserDetail(id: string): Promise<UserItemVo> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return plainToInstance(UserInfoVo, user);
  }

  // 根据账号查询
  async findByAccount(account: string) {
    return this.userRepo.findOne({ where: { account } });
  }

  // 个人注册账号
  async createUser(data: Partial<User>) {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  // 管理员新增账号
  async addUser(data: CreateUserDto): Promise<string> {
    const { password, account } = data;
    const user = await this.findByAccount(account);
    if (user) {
      throw new NotFoundException('账号已存在');
    }
    data.password = await bcrypt.hash(password, 10);
    this.userRepo.create(data);
    await this.userRepo.save(data);
    return '添加成功';
  }

  // 编辑
  async editUser(data: EditUserDto): Promise<string> {
    const result = await this.userRepo.update(data.id, data);
    if (result.affected === 0) {
      throw new NotFoundException('用户不存在');
    }
    return '编辑成功';
  }

  // 修改登录ip
  async updateLoginIp(
    id: string,
    data: {
      last_login_ip: string;
      last_login_at: Date;
    },
  ): Promise<string> {
    const result = await this.userRepo.update(id, data);
    if (result.affected === 0) {
      throw new NotFoundException('用户不存在');
    }
    return '更新成功';
  }

  // 删除
  async delUser(id: string): Promise<string> {
    if (!id) {
      throw new NotFoundException('id不能为空');
    }
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('用户不存在');
    }
    return '删除成功';
  }
}
