import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Role } from './entites/role.entity';
import { CreateRoleDto } from './dto/role-create.dto';
import { EditRoleDto } from './dto/role-edit.dto';
import { RoleItemVo } from './vo/role-item.vo';

@Injectable()
export class RoleService {
  constructor(@InjectRepository(Role) private roleRepo: Repository<Role>) {}

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
  async delRole(id: string): Promise<string> {
    if (!id) {
      throw new NotFoundException('id不能为空');
    }
    const result = await this.roleRepo.delete(id);
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

  // 获取角色权限
  async getRolePermissions(id: string): Promise<string> {
    return '';
  }
}
