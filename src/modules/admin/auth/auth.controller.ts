import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() data: { account: string; password: string }): any {
    return this.authService.loginByPassword(data.account, data.password);
  }
}
