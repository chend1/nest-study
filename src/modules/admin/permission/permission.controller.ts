import { Body, Controller, Get, Post, Query, Param } from '@nestjs/common';
// dto
import { CreatePermissionDto } from './dto/permission-create.dto';
import { UpdatePermissionDto } from './dto/permission-edit.dto';
import { PermissionListQueryDto } from './dto/permission-query.dto';
// import { PermissionIdDto } from './dto/permission-id.dto';
// vo
import { PermissionItemVo } from './vo/permission-item.vo';
import { PermissionTreeVo } from './vo/permission-tree.vo';
// service
import { PermissionService } from './permission.service';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get('list')
  find(
    @Query() dto: PermissionListQueryDto,
  ): Promise<PermissionItemVo[] | PermissionTreeVo[]> {
    return this.permissionService.getPermissionList(dto);
  }

  @Post('add')
  add(@Body() data: CreatePermissionDto): Promise<string> {
    return this.permissionService.addPermission(data);
  }

  @Post('edit/:id')
  edit(
    @Param('id') id: string,
    @Body() dto: UpdatePermissionDto,
  ): Promise<string> {
    console.log('id', id);

    return this.permissionService.editPermission(id, dto);
  }

  @Post('del/:id')
  del(@Param('id') id: string): Promise<string> {
    return this.permissionService.delPermission(id);
  }
}
