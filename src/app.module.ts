import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
// 数据库
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';
// 管理后台模块
import { AuthModule } from './modules/admin/auth/auth.module';
import { UserModule } from './modules/admin/user/user.module';
import { RoleModule } from './modules/admin/role/role.module';
import { PermissionModule } from './modules/admin/permission/permission.module';
import { CategoryModule } from './modules/admin/category/category.module';
import { BrandModule } from './modules/admin/brand/brand.module';
import { ProductModule } from './modules/admin/product/product.module';

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
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    CategoryModule,
    BrandModule,
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
