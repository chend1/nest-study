import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreatePermissionDto } from './dto/permission-create.dto';
import { EditPermissionDto } from './dto/permission-edit.dto';
import { PermissionItemVo } from './vo/permission-item.vo';
import { PermissionService } from './permission.service';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get('list')
  findAll(@Query() params: { name: string }): Promise<PermissionItemVo[]> {
    return this.permissionService.getPermissionList(params);
  }

  @Post('add')
  add(@Body() data: CreatePermissionDto): Promise<string> {
    return this.permissionService.addPermission(data);
  }

  @Post('edit')
  edit(@Body() data: EditPermissionDto): Promise<string> {
    return this.permissionService.editPermission(data);
  }

  @Post('del')
  del() {}
}
