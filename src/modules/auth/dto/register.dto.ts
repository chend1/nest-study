import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum IdentifierType {
  PHONE = 'phone',
  EMAIL = 'email',
}

export class RegisterDto {
  @IsEnum(IdentifierType)
  identifier_type: IdentifierType;

  @IsString()
  @IsNotEmpty({
    message: '手机号或邮箱不能为空',
  })
  identifier: string; // 手机号 / 邮箱

  @IsString()
  @IsNotEmpty({
    message: '验证码不能为空',
  })
  sms_code: string; // 验证码
}
