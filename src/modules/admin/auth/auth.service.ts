import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // 生成token
  private generateToken(user: { id: number; name: string }) {
    const payload = {
      id: user.id,
      name: user.name,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  // 账号密码登录
  async loginByPassword(account: string, password: string) {
    const user = await this.userService.findByAccount(account);
    if (!user || !user.password) {
      throw new BadRequestException('账号不存在');
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new BadRequestException('密码错误');
    }
    return this.generateToken(user);
  }
}
