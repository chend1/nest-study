import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
// 数据库
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    // 环境变量
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    // 数据库
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
