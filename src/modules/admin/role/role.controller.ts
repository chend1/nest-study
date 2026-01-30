import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
// dto
import { CreateRoleDto } from './dto/role-create.dto';
import { UpdateRoleDto } from './dto/role-edit.dto';
import { AssignRolePermissionDto } from './dto/role-assign.dto';
// vo
import { RoleItemVo } from './vo/role-item.vo';
import { RoleDetailVo } from './vo/role-info.vo';
// service
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // 获取角色列表
  @Get('list')
  async findAll(@Query() params: { name: string }): Promise<RoleItemVo[]> {
    // console.log('获取角色列表');
    return this.roleService.getRoleList(params);
  }

  // 新增角色
  @Post('add')
  async create(@Body() data: CreateRoleDto): Promise<string> {
    return this.roleService.createRole(data);
  }

  // 编辑角色
  @Post('edit/:id')
  async edit(
    @Param('id') id: string,
    @Body() data: UpdateRoleDto,
  ): Promise<string> {
    return this.roleService.editRole(id, data);
  }

  // 删除角色
  @Post('del/:id')
  async del(@Param('id') id: string): Promise<string> {
    return this.roleService.delRole(id);
  }

  // // 获取角色详情
  // @Get('detail')
  // async getRoleDetail() {}

  // 获取角色权限
  @Get('permission/:id')
  async getRolePermission(@Param('id') id: string): Promise<string[]> {
    return this.roleService.getRolePermissions(id);
  }

  // 设置角色权限
  @Post('assign-permission')
  async setRolePermission(
    @Body() data: AssignRolePermissionDto,
  ): Promise<string> {
    return this.roleService.assignPermissions(data);
  }
}
