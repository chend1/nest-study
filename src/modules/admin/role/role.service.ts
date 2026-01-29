import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Permission } from '../permission/entites/permission.entity';
import { CreateRoleDto } from './dto/role-create.dto';
import { EditRoleDto, RoleIdDto } from './dto/role-edit.dto';
import { AssignRolePermissionDto } from './dto/role-assign.dto';
import { RoleItemVo } from './vo/role-item.vo';
import { Role } from './entites/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
  ) {}

  // 获取角色列表
  async getRoleList(params: { name: string }) {
    const { name } = params;
    const where = name ? { name: Like(`%${name}%`) } : {};
    const list = await this.roleRepo.find({
      where,
    });
    return plainToInstance(RoleItemVo, list);
  }

  // 新增角色
  async createRole(data: CreateRoleDto): Promise<string> {
    const { code, name } = data;
    const role = await this.roleRepo.findOne({ where: [{ code }, { name }] });
    if (role) {
      throw new Error('角色已存在');
    }
    this.roleRepo.create(data);
    await this.roleRepo.save(data);
    return '添加成功';
  }

  // 编辑角色
  async editRole(data: EditRoleDto): Promise<string> {
    const { id } = data;
    if (!id) {
      throw new NotFoundException('id不能为空');
    }
    const result = await this.roleRepo.update(id, data);
    if (result.affected === 0) {
      throw new NotFoundException('角色不存在');
    }
    return '编辑成功';
  }

  // 删除角色
  async delRole(data: RoleIdDto): Promise<string> {
    // 判断角色是否有用户使用
    const user = await this.roleRepo
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.users', 'user')
      .where('role.id = :id', { id: data.id })
      .getOne();
    if (user) {
      throw new Error('角色已被用户使用，无法删除');
    }
    // 删除
    const result = await this.roleRepo.delete(data.id);
    if (result.affected === 0) {
      throw new Error('角色不存在');
    }
    return '删除成功';
  }

  // 获取角色详情
  async getRoleDetail(id: string): Promise<RoleItemVo> {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException('角色不存在');
    }
    return plainToInstance(RoleItemVo, role);
  }
  // 分配角色权限
  async assignPermissions(data: AssignRolePermissionDto): Promise<string> {
    const { role_id, permission_ids } = data;
    // 查询角色（必须带 permissions）
    const role = await this.roleRepo.findOne({
      where: { id: role_id },
      relations: ['permissions'],
    });
    if (!role) {
      throw new BadRequestException('角色不存在');
    }
    // 2. 查询权限
    const permissions = await this.permissionRepo.findBy({
      id: In(permission_ids),
    });
    if (permissions.length !== permission_ids.length) {
      throw new BadRequestException('部分权限不存在');
    }
    // 3. 直接覆盖（TypeORM 会自动维护 role_permission）
    role.permissions = permissions;
    // 4. 保存
    await this.roleRepo.save(role);
    return '授权成功';
  }

  // 获取角色权限
  async getRolePermissions(id: string): Promise<string[]> {
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!role) {
      throw new BadRequestException('角色不存在');
    }
    return role.permissions.map((p) => p.id);
  }
}
