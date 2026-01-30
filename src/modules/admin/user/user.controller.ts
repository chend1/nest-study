import { Controller, Get, Query, Post, Body, Req, Param } from '@nestjs/common';
// service
import { UserService } from './user.service';
// dto
import { UserListDto } from './dto/user-list.dto';
import { CreateUserDto } from './dto/user-create.dto';
import { EditUserDto } from './dto/user-edit.dto';
import { UserIdDto } from './dto/user-id.dto';
import { AssignUserRoleDto } from './dto/user-assign.dto';
// vo
import { UserListVo } from './vo/user-list.vo';
import { UserItemVo } from './vo/user-item.vo';
import { LoginUserVo } from './vo/user-login-info.vo';

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
  detail(@Param(':id') id: string): Promise<UserItemVo> {
    return this.userService.getUserDetail(id);
  }

  // 获取用户登录信息
  @Get('info')
  getLoginInfo(@Req() req: any): Promise<LoginUserVo> {
    return this.userService.getUserLoginInfo(req.user.id);
  }

  // 新增用户
  @Post('add')
  create(@Body() data: CreateUserDto): Promise<string> {
    return this.userService.createUser(data);
  }

  // 编辑用户
  @Post('edit')
  edit(@Query(':id') id: string, @Body() data: EditUserDto): Promise<string> {
    return this.userService.editUser(id, data);
  }

  // 角色分配
  @Post('assign-role')
  assignRole(@Body() data: AssignUserRoleDto): Promise<string> {
    return this.userService.assignRole(data);
  }

  // 删除用户
  @Post('del')
  del(@Body() data: UserIdDto): Promise<string> {
    return this.userService.delUser(data.id);
  }
}
