import { Controller, Body, Post, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller()
export class UserAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sendVerifyCode')
  sendVerifyCode(@Body() params: { email: string }): any {
    return this.authService.sendVerifyCode(params.email);
  }

  @Post('login')
  login(@Body() params: LoginDto): any {
    console.log(params);
    if (params.type === 'password') {
      return this.authService.loginByPassword(
        params.identifier,
        params.credential,
      );
    } else {
      return this.authService.loginByCode(params.identifier, params.credential);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/user/info')
  me(@Req() req: { user: { id: number } }) {
    return this.authService.getUserInfo(req.user.id);
  }
}
