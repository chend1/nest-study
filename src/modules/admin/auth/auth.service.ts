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
  async loginByPassword(account: string, password: string, ip: string) {
    const user = await this.userService.findByAccount(account);
    if (!user || !user.password) {
      throw new BadRequestException('账号不存在');
    }
    const { password: dbPassword, status, deleted_at } = user;
    if (status === 2 || deleted_at) {
      throw new BadRequestException('账号已禁用');
    }
    if (status === 3) {
      throw new BadRequestException('账号已锁定');
    }
    const isValid = await bcrypt.compare(password, dbPassword);
    if (!isValid) {
      throw new BadRequestException('密码错误');
    }
    if (ip) {
      // 记录登录 IP / 时间
      await this.userService.updateLoginIp(user.id, {
        last_login_ip: ip,
        last_login_at: new Date(),
      });
    }
    return this.generateToken(user);
  }
}
