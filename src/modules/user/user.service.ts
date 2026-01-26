import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './entites/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}
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

  createUser(user: any) {
    return this.userRepo.save(user);
  }

  async findByAccount(account: string) {
    return this.userRepo.findOneBy({ account });
  }

  async findByEmail(email: string) {
    return this.userRepo.findOneBy({ email });
  }

  async findByPhone(phone: string) {
    return this.userRepo.findOneBy({ phone });
  }

  async findById(id: number) {
    return this.userRepo.findOneBy({ id });
  }
}
