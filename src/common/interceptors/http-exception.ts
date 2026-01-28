// common/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const res: any = exception.getResponse();
    // console.log(res);

    response.status(200).json({
      code: status,
      message: res.message || '请求失败',
      data: null,
      timestamp: Date.now(),
    });
  }
}
