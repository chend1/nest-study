import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { plainToInstance } from 'class-transformer';

// 数据库实体
import { Brand } from './entities/brand.entity';

// dto
import { CreateBrandDto } from './dto/brand-create.dto';
import { UpdateBrandDto } from './dto/brand-edit.dto';
import { QueryBrandDto } from './dto/brand-query.dto';
// vo
import { BrandInfoVo } from './vo/brand-info.vo';
import { BrandItemVo } from './vo/brand-item.vo';

@Injectable()
export class BrandService {
  constructor(@InjectRepository(Brand) private brandRepo: Repository<Brand>) {}

  // 获取品牌列表
  async getBrandList(dto: QueryBrandDto) {
    const { name, status } = dto;
    const where = {};
    if (name) {
      where['name'] = Like(`%${name}%`);
    }
    if (status !== undefined) {
      where['status'] = status;
    }
    const list = await this.brandRepo.find({
      where,
      order: { sort: 'ASC' },
    });
    return plainToInstance(BrandItemVo, list);
  }
  // 检查品牌名称是否唯一
  private async checkNameUnique(
    name: string,
    excludeId?: string,
  ): Promise<void> {
    const qb = this.brandRepo
      .createQueryBuilder('brand')
      .where('brand.name = :name', { name });
    if (excludeId) {
      qb.andWhere('brand.id != :id', { id: excludeId });
    }
    const exist = await qb.getOne();
    if (exist) {
      throw new BadRequestException('品牌名称已存在');
    }
  }

  // 新增品牌
  async createBrand(dto: CreateBrandDto) {
    const { name } = dto;
    await this.checkNameUnique(name);
    this.brandRepo.create(dto);
    await this.brandRepo.save(dto);
    return '添加成功';
  }

  // 修改品牌
  async editBrand(id: string, dto: UpdateBrandDto) {
    const { name } = dto;
    if (name) {
      await this.checkNameUnique(name, id);
    }
    await this.brandRepo.update(id, dto);
    return '修改成功';
  }

  // 删除品牌
  async delBrand(id: string) {
    await this.brandRepo.delete(id);
    return '删除成功';
  }
}
