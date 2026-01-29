import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException('token已过期');
    }

    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException('token无效');
    }

    if (err || !user) {
      throw new UnauthorizedException('未登录');
    }

    return user;
  }
}
