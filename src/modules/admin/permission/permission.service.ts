import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Permission } from './entites/permission.entity';
import { buildTree } from 'src/common/utils';
import { CreatePermissionDto } from './dto/permission-create.dto';
import { EditPermissionDto, PermissionIdDto } from './dto/permission-edit.dto';
import { PermissionItemVo } from './vo/permission-item.vo';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
  ) {}

  // 获取权限列表
  async getPermissionList(params: {
    name: string;
  }): Promise<PermissionItemVo[]> {
    const { name } = params;
    const where = name ? { name: Like(`%${name}%`) } : {};
    const list = await this.permissionRepo.find({
      where,
      order: {
        sort: 'ASC',
        id: 'ASC',
      },
    });
    return buildTree(list);
  }

  // 新增权限
  async addPermission(data: CreatePermissionDto): Promise<string> {
    const { name } = data;
    const permission = await this.permissionRepo.findOne({
      where: [{ name }],
    });
    if (permission) {
      throw new Error('权限已存在');
    }
    this.permissionRepo.create(data);
    await this.permissionRepo.save(data);
    return '添加成功';
  }

  // 编辑权限
  async editPermission(data: EditPermissionDto): Promise<string> {
    const { id } = data;
    const result = await this.permissionRepo.update(id, data);
    if (result.affected === 0) {
      throw new NotFoundException('权限不存在');
    }
    return '编辑成功';
  }

  // 删除权限
  async delPermission(params: PermissionIdDto): Promise<string> {
    const { id } = params;
    const result = await this.permissionRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('权限不存在');
    }
    return '删除成功';
  }
}
