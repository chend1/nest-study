import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository, Like, In } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entites/user.entity';
import { UserListDto } from './dto/user-list.dto';
import { CreateUserDto } from './dto/user-create.dto';
import { EditUserDto } from './dto/user-edit.dto';
import { AssignUserRoleDto } from './dto/user-assign.dto';
import { UserListVo } from './vo/user-list.vo';
import { UserItemVo } from './vo/user-item.vo';
import { UserInfoVo, UserLoginInfoVo } from './vo/user-info.vo';
import { Role } from '../role/entites/role.entity';
import { Permission } from '../permission/entites/permission.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
  ) {}
  // 获取用户列表
  async getUserList(params: UserListDto): Promise<UserListVo> {
    const { page, size, name } = params;
    const where = name ? { name: Like(`%${name}%`) } : {};
    const [list, total] = await this.userRepo.findAndCount({
      where,
      skip: (page - 1) * size,
      take: size,
    });
    return {
      list: plainToInstance(UserItemVo, list),
      total,
      page,
      size,
    };
  }

  // 获取用户详情
  async getUserDetail(id: string): Promise<UserItemVo> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['roles'],
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return plainToInstance(UserInfoVo, user);
  }

  // 获取用户登录信息
  async getUserLoginInfo(id: string): Promise<UserLoginInfoVo> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['roles', 'roles.permissions'],
    });
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }
    // 角色
    const roles = user.roles.map((r) => ({
      id: r.id,
      code: r.code,
      name: r.name,
    }));
    // 权限去重
    const permissionSet = new Set<string>();
    user.roles.forEach((role) => {
      role.permissions.forEach((perm) => {
        if (perm.type === 3) {
          permissionSet.add(perm.code);
        }
      });
    });

    // 获取角色菜单权限
    const allPermissions = user.roles.flatMap((role) => role.permissions);
    // 按 id 去重
    const permissionMap = new Map<string, Permission>();
    allPermissions.forEach((p) => {
      permissionMap.set(p.id, p);
    });
    const permissions = Array.from(permissionMap.values());
    const menuPermissions = permissions.filter((p) => p.type === 1);

    function _buildMenuTree(
      menus: Permission[],
      parentId: string | null = null,
    ) {
      return menus
        .filter((m) => m.parent_id === parentId)
        .sort((a, b) => a.sort - b.sort)
        .map((m) => ({
          id: m.id,
          name: m.name,
          path: m.path,
          icon: m.icon,
          children: _buildMenuTree(menus, m.id),
        }));
    }
    const menuTree = _buildMenuTree(menuPermissions);

    return {
      id: user.id,
      name: user.name,
      account: user.account,
      avatar: user.avatar,
      roles,
      permissions: Array.from(permissionSet),
      menus: menuTree,
    };
  }

  // 根据账号查询
  async findByAccount(account: string) {
    return this.userRepo.findOne({ where: { account } });
  }

  // 管理员新增账号
  async createUser(data: CreateUserDto): Promise<string> {
    const { password, account } = data;
    const user = await this.findByAccount(account);
    if (user) {
      throw new NotFoundException('账号已存在');
    }
    data.password = await bcrypt.hash(password, 10);
    this.userRepo.create(data);
    await this.userRepo.save(data);
    return '添加成功';
  }

  // 编辑账号
  async editUser(data: EditUserDto): Promise<string> {
    const result = await this.userRepo.update(data.id, data);
    if (result.affected === 0) {
      throw new NotFoundException('用户不存在');
    }
    return '编辑成功';
  }

  // 修改登录ip
  async updateLoginIp(
    id: string,
    data: {
      last_login_ip: string;
      last_login_at: Date;
    },
  ): Promise<string> {
    const result = await this.userRepo.update(id, data);
    if (result.affected === 0) {
      throw new NotFoundException('用户不存在');
    }
    return '更新成功';
  }

  // 分配角色
  async assignRole(data: AssignUserRoleDto): Promise<string> {
    const { user_id, role_ids } = data;
    const user = await this.userRepo.findOne({
      where: { id: user_id },
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    const roles = await this.roleRepo.findBy({
      id: In(role_ids),
    });
    if (roles.length !== role_ids.length) {
      throw new NotFoundException('部分角色不存在');
    }
    user.roles = roles; // 覆盖式分配
    await this.userRepo.save(user);
    return '分配成功';
  }

  // 删除
  async delUser(id: string): Promise<string> {
    if (!id) {
      throw new NotFoundException('id不能为空');
    }
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('用户不存在');
    }
    return '删除成功';
  }
}
