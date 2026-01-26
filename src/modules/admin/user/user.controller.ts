import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UserListDto } from './dto/user-list.dto';
import { CreateUserDto } from './dto/user-create.dto';
import { EditUserDto } from './dto/user-edit.dto';
import { UserListVo } from './vo/user-list.vo';
import { UserItemVo } from './vo/user-item.vo';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // 获取用户列表
  @Get('list')
  find(@Query() params: UserListDto): Promise<UserListVo> {
    return this.userService.getUserList(params);
  }
  // 获取用户详情
  @Get('detail')
  detail(@Query('id') id: number): Promise<UserItemVo> {
    return this.userService.getUserDetail(id);
  }

  // 根据token获取用户信息
  @UseGuards(AuthGuard('jwt'))
  @Get('info')
  getLoginInfo(@Req() req: any): Promise<UserItemVo> {
    return this.userService.getUserDetail(req.user.id);
  }

  // 新增用户
  @Post('add')
  create(@Body() data: CreateUserDto): Promise<string> {
    return this.userService.addUser(data);
  }

  // 编辑用户
  @Post('edit')
  edit(@Body() data: EditUserDto): Promise<string> {
    console.log('编辑用户', data);

    return this.userService.editUser(data);
  }

  // 删除用户
  @Post('del')
  del(@Body() data: { id: number }): Promise<string> {
    return this.userService.delUser(data.id);
  }
}
