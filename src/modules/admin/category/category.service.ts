import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// 数据库实体
import { Category } from './entites/category.entity';
// dto
import { CreateCategoryDto } from './dto/category-create.dto';
import { CategoryEditDto } from './dto/category-edit.dto';
import { CategoryIdDto } from './dto/category-id.dto';
import { CategoryQueryDto } from './dto/category-query.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}
  /*  查询 -------------------------------- */
  // 平铺列表
  async getList() {
    return this.categoryRepo.find({
      order: { sort: 'ASC' },
    });
  }
  // 树形结构
  async getTree() {
    const list = await this.getList();
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
    const category = this.categoryRepo.create({
      ...dto,
      parent_id: parent?.id ?? '0',
      level: parent ? parent.level + 1 : 1,
    });
    return this.categoryRepo.save(category);
  }

  /*  修改-------------------------------- */
  async edit(dto: CategoryEditDto) {
    const category = await this.categoryRepo.findOne({
      where: { id: dto.id },
    });
    if (!category) {
      throw new NotFoundException('分类不存在');
    }
    if (category.parent_id !== dto.parent_id) {
      // 父级合法性校验
      await this.validateParent(dto.id, dto.parent_id);
      // 同步更新子分类 level
      await this.updateChildrenLevel(dto.id, category.level);
    }
    // 重新计算 level
    await this.updateChildrenLevel(dto.id, category.level);
    return this.categoryRepo.update(dto.id, dto);
  }

  /*  删除-------------------------------- */
  async delete(dto: CategoryIdDto) {}

  /*  私有方法-------------------------------- */
  // 构建分类树
  private buildTree(
    list: Category[],
    parentId: string | null = null,
    visited = new Set<string>(),
  ) {
    return list
      .filter((item) => item.parent_id === parentId)
      .map((item) => {
        if (visited.has(item.id)) {
          return null;
        }
        visited.add(item.id);

        return {
          ...item,
          children: this.buildTree(list, item.id, visited),
        };
      })
      .filter(Boolean);
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
