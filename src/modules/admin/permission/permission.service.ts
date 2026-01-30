import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { plainToInstance } from 'class-transformer';
// 数据库实体
import { Permission } from './entites/permission.entity';
// dto
import { CreatePermissionDto } from './dto/permission-create.dto';
import { UpdatePermissionDto } from './dto/permission-edit.dto';
import { PermissionListQueryDto } from './dto/permission-query.dto';
// vo
import { PermissionItemVo } from './vo/permission-item.vo';
import { PermissionTreeVo } from './vo/permission-tree.vo';
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
  async getPermissionList(
    query: PermissionListQueryDto,
  ): Promise<PermissionTreeVo[] | PermissionItemVo[]> {
    const { name, tree, type } = query;
    const where: any = {};
    if (name) {
      where.name = Like(`%${name}%`);
    }
    if (type || type === 0) {
      where.type = type;
    }
    const list = await this.permissionRepo.find({
      where,
      order: {
        sort: 'ASC',
        id: 'ASC',
      },
    });
    if (tree) {
      return this.buildTree(plainToInstance(PermissionItemVo, list));
    }
    return plainToInstance(PermissionItemVo, list);
  }

  // 新增权限
  async addPermission(data: CreatePermissionDto): Promise<string> {
    const { name, code, type, parent_id, path } = data;
    // 接口 / 按钮 必须有 code
    if ([2, 3].includes(type) && !code) {
      throw new BadRequestException('接口/按钮权限必须填写code');
    }
    if (type === 1 && !path) {
      throw new BadRequestException('菜单权限必须填写path');
    }
    // code 唯一校验
    if (code) {
      const codeExists = await this.permissionRepo.findOne({
        where: { code },
      });
      if (codeExists) {
        throw new BadRequestException('权限 code 已存在');
      }
    }
    // 父级校验
    if (parent_id) {
      const parent = await this.permissionRepo.findOne({
        where: { id: parent_id },
      });
      if (!parent) {
        throw new BadRequestException('父级权限不存在');
      }
    }
    const permission = await this.permissionRepo.findOne({
      where: [{ name, type }],
    });
    if (permission) {
      throw new BadRequestException('同级权限名称已存在');
    }
    const entity = this.permissionRepo.create(data);
    await this.permissionRepo.save(entity);
    return '添加成功';
  }

  // 编辑权限
  async editPermission(id: string, data: UpdatePermissionDto): Promise<string> {
    const permission = await this.permissionRepo.findOne({
      where: { id },
    });
    if (!permission) {
      throw new NotFoundException('权限不存在');
    }
    if (data.code && data.code !== permission.code && permission.type === 2) {
      throw new BadRequestException('接口权限不允许修改标code');
    }
    if (data.parent_id === id) {
      throw new BadRequestException('不能选择自身作为父级');
    }
    const result = await this.permissionRepo.update(id, data);
    if (result.affected === 0) {
      throw new NotFoundException('权限不存在');
    }
    return '编辑成功';
  }

  // 删除权限
  async delPermission(id: string): Promise<string> {
    console.log('id', id);

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

  // 构建树形结构
  private buildTree(list: PermissionItemVo[]): PermissionTreeVo[] {
    console.log('list', list);

    const map = new Map<string, PermissionTreeVo>();
    const result: PermissionTreeVo[] = [];
    list.forEach((item) => {
      map.set(item.id, { ...item, children: [] });
    });
    list.forEach((item) => {
      const node = map.get(item.id)!;
      if (item.parent_id && map.has(item.parent_id)) {
        map.get(item.parent_id)!.children!.push(node);
      } else {
        result.push(node);
      }
    });

    return result;
  }
}
