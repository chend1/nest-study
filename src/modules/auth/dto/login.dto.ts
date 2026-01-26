import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum LoginType {
  PASSWORD = 'password',
  SMS = 'sms',
}

export class LoginDto {
  @IsString()
  @IsNotEmpty({
    message: '手机号或邮箱不能为空',
  })
  identifier: string; // 手机号 / 邮箱

  @IsString()
  @IsNotEmpty({
    message: '密码或验证码不能为空',
  })
  credential: string; // 密码 或 验证码

  @IsEnum(LoginType)
  type: LoginType;
}
