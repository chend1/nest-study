import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { RegisterDto, IdentifierType } from './dto/register.dto';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  // 校验验证码
  private async verifyCode(identifier: string, inputCode: string) {
    const data = await this.mailService.getCode(identifier);
    if (!data) {
      throw new BadRequestException('验证码已过期');
    }
    const { code, expire } = data;
    if (expire < Date.now()) {
      throw new BadRequestException('验证码已过期');
    }
    if (code !== inputCode) {
      throw new BadRequestException('验证码错误');
    }
    await this.mailService.deleteCode(identifier);
  }

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

  // 发送验证码
  async sendVerifyCode(email: string) {
    return this.mailService.sendVerifyCode(email);
  }

  // 用户-注册
  async register(dto: RegisterDto) {
    const { identifier, sms_code, identifier_type } = dto;

    if (identifier_type === IdentifierType.PHONE) {
      // 校验手机号
    }

    if (identifier_type === IdentifierType.EMAIL) {
      // 校验邮箱
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
      if (!isEmail) {
        throw new BadRequestException('邮箱格式错误');
      }
      // 1. 是否已存在
      const exists = await this.userService.findByEmail(identifier);
      if (exists) {
        throw new BadRequestException('账号已存在');
      }
      //  2. 验证邮箱验证码
      await this.verifyCode(identifier, sms_code);
    }

    //  创建用户（交给 UserService）
    const user = await this.userService.createUser(dto);

    return {
      message: '注册成功',
      userId: user.id,
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

  // 验证码登录
  async loginByCode(identifier: string, code: string) {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const isPhone = /^1[3-9]\d{9}$/.test(identifier);

    if (!isEmail && !isPhone) {
      throw new BadRequestException('账号格式不正确');
    }

    if (isEmail) {
      await this.verifyCode(identifier, code);
      const user = await this.userService.findByEmail(identifier);
      if (!user) {
        throw new BadRequestException('账号不存在');
      }
      return this.generateToken(user);
    }

    // phone 后续补
  }

  // 获取用户信息
  async getUserInfo(userId: number) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
    };
  }
}
