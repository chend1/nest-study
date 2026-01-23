import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { UserEntity } from './entites/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}
  async getUserList(params: any) {
    const { page = 1, size = 10, name } = params;
    const where = name ? { name: Like(`%${name}%`) } : {};
    const [list, total] = await this.userRepo.findAndCount({
      take: size,
      skip: (page - 1) * size,
      where,
    });
    return {
      list,
      total,
      page,
      size,
    };
  }
}
