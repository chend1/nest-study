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
import { EditUserDto, UserIdDto } from './dto/user-edit.dto';
import { AssignUserRoleDto } from './dto/user-assign.dto';
import { UserListVo } from './vo/user-list.vo';
import { UserItemVo } from './vo/user-item.vo';
import { UserLoginInfoVo } from './vo/user-info.vo';

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
  detail(@Query() data: UserIdDto): Promise<UserItemVo> {
    return this.userService.getUserDetail(data.id);
  }

  @Get('info')
  getLoginInfo(@Req() req: any): Promise<UserLoginInfoVo> {
    return this.userService.getUserLoginInfo(req.user.id);
  }

  // 新增用户
  @Post('add')
  create(@Body() data: CreateUserDto): Promise<string> {
    return this.userService.createUser(data);
  }

  // 编辑用户
  @Post('edit')
  edit(@Body() data: EditUserDto): Promise<string> {
    return this.userService.editUser(data);
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
