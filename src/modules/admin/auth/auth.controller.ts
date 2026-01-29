import { Controller, Body, Post, Req } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(
    @Body() data: { account: string; password: string },
    @Req() req: Request,
  ): Promise<{ token: string }> {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || '';
    return this.authService.loginByPassword(data.account, data.password, ip);
  }
}
