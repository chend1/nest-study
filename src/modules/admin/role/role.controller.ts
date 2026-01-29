import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateRoleDto } from './dto/role-create.dto';
import { EditRoleDto, RoleIdDto } from './dto/role-edit.dto';
import { RoleItemVo } from './vo/role-item.vo';
import { AssignRolePermissionDto } from './dto/role-assign.dto';
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
  @Post('edit')
  async edit(@Body() data: EditRoleDto): Promise<string> {
    return this.roleService.editRole(data);
  }

  // 删除角色
  @Post('del')
  async del(@Body() data: RoleIdDto): Promise<string> {
    return this.roleService.delRole(data);
  }

  // 获取角色详情
  @Get('detail')
  async getRoleDetail() {}

  // 获取角色权限
  @Get('permission')
  async getRolePermission(@Query() params: RoleIdDto): Promise<string[]> {
    return this.roleService.getRolePermissions(params.id);
  }

  // 设置角色权限
  @Post('assign-permission')
  async setRolePermission(
    @Body() data: AssignRolePermissionDto,
  ): Promise<string> {
    return this.roleService.assignPermissions(data);
  }
}
