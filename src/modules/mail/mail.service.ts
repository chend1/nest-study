import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  private codeStore = new Map<string, { code: string; expire: number }>();

  async sendVerifyCode(email: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    // 5分钟过期
    this.codeStore.set(email, {
      code,
      expire: Date.now() + 5 * 60 * 1000,
    });

    console.log('验证码:', code); // 先用控制台代替发邮件

    return { message: '验证码已发送' };
  }

  async getCode(email: string) {
    return this.codeStore.get(email);
  }

  async deleteCode(email: string) {
    this.codeStore.delete(email);
  }
}
