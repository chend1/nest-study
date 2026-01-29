import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Permission } from './entites/permission.entity';
import { buildTree } from 'src/common/utils';
import { CreatePermissionDto } from './dto/permission-create.dto';
import { EditPermissionDto, PermissionIdDto } from './dto/permission-edit.dto';
import { PermissionItemVo } from './vo/permission-item.vo';
import { Role } from '../role/entites/role.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
    @InjectRepository(Role)
    private RoleRepo: Repository<Role>,
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
    const { name, code, type } = data;
    const permission = await this.permissionRepo.findOne({
      where: [
        { name, type },
        { code, type },
      ],
    });
    if (permission) {
      throw new BadRequestException('权限已存在');
    }
    this.permissionRepo.create(data);
    await this.permissionRepo.save(data);
    return '添加成功';
  }

  // 编辑权限
  async editPermission(data: EditPermissionDto): Promise<string> {
    const { id } = data;
    const permission = await this.permissionRepo.findOne({
      where: { id },
    });
    if (!permission) {
      throw new NotFoundException('权限不存在');
    }
    if (data.code && data.code !== permission.code && permission.type === 2) {
      throw new BadRequestException('接口权限不允许修改标code');
    }
    if (data.parent_id === permission.id) {
      throw new BadRequestException('不能选择自身作为父级');
    }
    const result = await this.permissionRepo.update(id, data);
    if (result.affected === 0) {
      throw new NotFoundException('权限不存在');
    }
    return '编辑成功';
  }

  // 删除权限
  async delPermission(params: PermissionIdDto): Promise<string> {
    const { id } = params;
    // 判断权限是否存在
    const permission = await this.permissionRepo.findOne({
      where: { id },
    });
    if (!permission) {
      throw new NotFoundException('权限不存在');
    }

    // 是否有子权限
    const children = await this.permissionRepo.find({
      where: { parent_id: id },
    });
    if (children.length > 0) {
      throw new BadRequestException('权限存在子权限，无法删除');
    }

    // 判断权限是否被角色使用
    const role = await this.RoleRepo.createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'permission')
      .where('permission.id = :id', { id })
      .getOne();
    if (role) {
      throw new BadRequestException('权限已被角色使用，无法删除');
    }
    // 删除
    const result = await this.permissionRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('权限不存在');
    }
    return '删除成功';
  }
}
