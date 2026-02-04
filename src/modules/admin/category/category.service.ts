import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, IsNull, DataSource } from 'typeorm';
import { plainToInstance } from 'class-transformer';
// 数据库实体
import { Category } from './entities/category.entity';
// dto
import { CreateCategoryDto } from './dto/category-create.dto';
import { CategoryEditDto } from './dto/category-edit.dto';
import { CategoryQueryDto } from './dto/category-query.dto';
// vo
import { CategoryItemVo } from './vo/category-item.vo';
import { CategoryTreeVo } from './vo/category-tree.vo';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    private dataSource: DataSource,
  ) {}
  /*  查询 -------------------------------- */
  // 平铺列表
  async getList(params?: CategoryQueryDto) {
    const { name, status } = params ?? {};
    const where: any = {};
    if (name) {
      where.name = Like(`%${name}%`);
    }
    if (status !== undefined) {
      where.status = status;
    }
    const list = await this.categoryRepo.find({
      where,
      order: { sort: 'ASC' },
    });
    return plainToInstance(CategoryItemVo, list);
  }
  // 树形结构
  async getTree(
    params?: Pick<CategoryQueryDto, 'status'>,
  ): Promise<CategoryTreeVo[]> {
    const list = await this.getList(params);
    return this.buildTree(list);
  }

  /*  新增-------------------------------- */
  async create(dto: CreateCategoryDto) {
    const parent = dto.parent_id
      ? await this.categoryRepo.findOne({
          where: { id: dto.parent_id },
        })
      : null;
    const level = parent ? parent.level + 1 : 1;
    if (level > 3) {
      throw new BadRequestException('最多三级分类');
    }
    const parentId = parent ? parent.id : null;
    // 同级名称校验
    const nameExists = await this.categoryRepo.findOne({
      where: {
        name: dto.name,
        parent_id: parentId === null ? IsNull() : parentId,
      },
    });
    if (nameExists) {
      throw new BadRequestException('同级分类下名称不能重复');
    }
    const category = this.categoryRepo.create({
      ...dto,
      parent_id: parentId,
      level: parent ? parent.level + 1 : 1,
      path: '',
    });
    await this.categoryRepo.save(category);
    console.log('category', category);

    // 修改path
    const path = parent ? `${parent.path}/${category.id}` : `/${category.id}`;
    await this.categoryRepo.update(category.id, { path });
    return '新增成功';
  }

  /*  修改-------------------------------- */
  async edit(id: string, dto: CategoryEditDto) {
    const categoryInfo = await this.categoryRepo.findOne({
      where: { id },
    });
    if (!categoryInfo) {
      throw new NotFoundException('分类不存在');
    }
    if (categoryInfo.parent_id !== dto.parent_id) {
      // 父级合法性校验
      await this.validateParent(id, dto.parent_id);
      // 使用事务修改分类
      await this.editWithTransaction(id, dto);
    } else {
      // 只修改当前分类基本信息
      await this.categoryRepo.update(id, {
        ...dto,
      });
    }
    return '修改成功';
  }
  // 使用事务修改分类
  async editWithTransaction(id: string, dto: CategoryEditDto) {
    const categoryInfo = await this.categoryRepo.findOne({
      where: { id },
    });
    if (!categoryInfo) {
      throw new NotFoundException('分类不存在');
    }
    return this.dataSource.transaction(async (manager) => {
      const oldPath = categoryInfo.path;
      const oldLevel = categoryInfo.level;
      // 新的path,level
      let newPath = oldPath;
      let newLevel = oldLevel;
      if (dto.parent_id === null) {
        newPath = `/${categoryInfo.id}`;
        newLevel = 1;
      } else {
        const parent = await manager.findOne(Category, {
          where: { id: dto.parent_id },
        });
        if (!parent) {
          throw new BadRequestException('父级分类不存在');
        }
        newLevel = parent.level + 1;
        newPath = `${parent.path}/${categoryInfo.id}`;
      }
      // 更新当前分类基本信息
      await manager.update(Category, id, {
        ...dto,
        path: newPath,
        level: newLevel,
      });
      // 同步更新子分类
      if (oldPath !== newPath) {
        await manager
          .createQueryBuilder()
          .update(Category)
          .set({
            path: () => `REPLACE(path, '${oldPath}', '${newPath}')`,
            level: () => `level - ${oldLevel} + ${newLevel}`,
          })
          .where('path LIKE :path', { path: `${oldPath}/%` })
          .execute();
      }
      return '修改成功';
    });
  }

  /*  删除-------------------------------- */
  async delete(id: string) {
    const result = await this.categoryRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('分类不存在');
    }
    return '删除成功';
  }

  /*  私有方法-------------------------------- */
  // 构建分类树
  private buildTree(
    list: CategoryItemVo[],
    parentId: string | null = null,
  ): CategoryTreeVo[] {
    return list
      .filter((item) => item.parent_id === parentId)
      .map((item) => ({
        ...item,
        children: this.buildTree(list, item.id),
      }));
  }

  // 父级合法性校验（防止死循环）
  private async validateParent(id: string, parentId?: string | null) {
    if (!parentId) return;

    if (id === parentId) {
      throw new BadRequestException('不能将分类设置为自己的父级');
    }

    const childrenIds = await this.getAllChildrenIds(id);
    if (childrenIds.includes(parentId)) {
      throw new BadRequestException('不能将分类设置为子分类的父级');
    }
  }
  // 获取所有子分类 id
  private async getAllChildrenIds(id: string): Promise<string[]> {
    const list = await this.getList();
    const result: string[] = [];
    const dfs = (parentId: string) => {
      list
        .filter((item) => item.parent_id === parentId)
        .forEach((item) => {
          result.push(item.id);
          dfs(item.id);
        });
    };
    dfs(id);
    return result;
  }
  // 同步更新子分类 level
  private async updateChildrenLevel(id: string, parentLevel: number) {
    const children = await this.categoryRepo.find({
      where: { parent_id: id },
    });

    for (const child of children) {
      const level = parentLevel + 1;
      await this.categoryRepo.update(child.id, { level });
      await this.updateChildrenLevel(child.id, level);
    }
  }
}
