import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response';
import { HttpExceptionFilter } from './common/interceptors/http-exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 启用全局异常拦截
  app.useGlobalFilters(new HttpExceptionFilter());
  // 启用全局数据返回
  app.useGlobalInterceptors(new ResponseInterceptor());
  // 全局序列化，不返回敏感信息
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
    }),
  );
  // 全局验证
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false, //没定义的字段，是否报错
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
