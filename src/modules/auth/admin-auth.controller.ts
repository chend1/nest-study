import { Controller, Body, Post, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('admin')
export class AdminAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() data: { account: string; password: string }): any {
    console.log(data);
    return this.authService.loginByPassword(data.account, data.password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('info')
  me(@Req() req: { user: { id: number } }) {
    return this.authService.getUserInfo(req.user.id);
  }
}
