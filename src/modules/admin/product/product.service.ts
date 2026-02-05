import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, In } from 'typeorm';
import { plainToInstance } from 'class-transformer';
// 实体
import { Product } from './entities/product.entity';
import { ProductSku } from './entities/product-sku.entity';
import { Category } from '../category/entities/category.entity';
import { Brand } from '../brand/entities/brand.entity';
// dto
import { CreateProductDto } from './dto/product-create.dto';
import { UpdateProductDto } from './dto/product-edit.dto';
import { QueryProductDto } from './dto/product-query.dto';
// vo
import { ProductDetailVo } from './vo/product-detail.vo';
import { ProductListVo } from './vo/product-list.vo';
import { ProductItemVo } from './vo/product-item.vo';

@Injectable()
export class ProductService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(ProductSku)
    private readonly skuRepo: Repository<ProductSku>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
  ) {}

  // 获取产品列表
  async getProductList(dto: QueryProductDto) {
    const { page = 1, size = 10, name, category_id, brand_id, status } = dto;
    const qb = this.productRepo
      .createQueryBuilder('p')
      .leftJoin('brand', 'b', 'b.id = p.brand_id')
      .leftJoin('category', 'c', 'c.id = p.category_id')
      .leftJoin('product_sku', 'sku', 'sku.product_id = p.id');
    // ===== 条件筛选 =====
    if (name) {
      qb.andWhere('p.name LIKE :name', { name: `%${name}%` });
    }
    // 分类
    if (category_id) {
      qb.andWhere('p.category_id = :category_id', { category_id });
    }
    // 品牌
    if (brand_id) {
      qb.andWhere('p.brand_id = :brand_id', { brand_id });
    }
    // 状态
    if (status) {
      qb.andWhere('p.status = :status', { status });
    }
    // ===== 查询字段 =====
    qb.select([
      'p.id as id',
      'p.name as name',
      'p.brand_id as brand_id',
      'p.category_id as category_id',
      'b.name as brand_name',
      'c.name as category_name',
      'p.status as status',
      'MIN(sku.price) as price',
      'SUM(sku.stock) as stock',
      'p.created_at as created_at',
    ]);
    // ===== 分组 =====
    qb.groupBy('p.id');

    // ===== 分页 =====
    qb.offset((page - 1) * size).limit(size);
    // ===== 排序 =====
    qb.orderBy('p.created_at', 'DESC');

    const [list, total] = await Promise.all([
      qb.getRawMany(),
      this.productRepo.count({
        where: {
          ...(status && { status }),
          ...(category_id && { category_id }),
          ...(brand_id && { brand_id }),
          ...(name && { name }),
        },
      }),
    ]);

    return {
      list: plainToInstance(ProductItemVo, list),
      total,
      page,
      size,
    };
  }

  // 获取产品详情
  async getDetail(id: string): Promise<ProductDetailVo> {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('商品不存在');
    }
    const skus = await this.skuRepo.find({
      where: { product_id: id },
      order: { id: 'ASC' },
    });

    return plainToInstance(ProductDetailVo, {
      ...product,
      skus,
    });
  }

  // 新增产品
  async createProduct(dto: CreateProductDto): Promise<string> {
    const { skus, category_id, brand_id, ...productData } = dto;
    if (!skus || skus.length === 0) {
      throw new BadRequestException('产品SKU 不能为空');
    }
    const category = await this.categoryRepo.findOne({
      where: { id: category_id },
    });
    if (!category) throw new BadRequestException('分类不存在');
    const codePro = await this.productRepo.findOne({
      where: { code: productData.code },
    });
    if (codePro) throw new BadRequestException('产品编码已存在');
    // 判断是否有相同sku_code
    const skuCodes = skus.map((sku) => sku.sku_code);
    const codes = new Set(skuCodes);
    if (skuCodes.length !== codes.size) {
      throw new BadRequestException('产品SKU编码重复');
    }

    const brand = await this.brandRepo.findOne({ where: { id: brand_id } });
    if (!brand) throw new BadRequestException('品牌不存在');
    return this.dataSource.transaction(async (manager) => {
      // 创建 Product
      const product = manager.create(Product, {
        ...productData,
        category_id,
        brand_id,
      });
      const savedProduct = await manager.save(product);

      // 创建 SKU
      const skuCodes = skus.map((sku) => sku.sku_code);
      const existSkus = await manager.find(ProductSku, {
        where: { sku_code: In(skuCodes) },
      });
      if (existSkus.length) throw new BadRequestException('产品SKU编码已存在');
      const skuEntities = skus.map((sku) =>
        manager.create(ProductSku, {
          ...sku,
          product_id: savedProduct.id,
        }),
      );
      await manager.save(skuEntities);
      return '添加成功';
    });
  }

  // 修改产品
  async editProduct(id: string, dto: UpdateProductDto) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('产品不存在');
    return this.dataSource.transaction(async (manager) => {
      // 更新 Product 基础信息
      await manager.update(Product, id, {
        ...dto,
        skus: undefined, // 不更新sku
      });

      // 更新 Product SKU
      if (dto.skus && dto.skus.length > 0) {
        // 获取产品已有的sku
        const dbSkus = await manager.find(ProductSku, {
          where: { product_id: id },
        });
        const dbIds = dbSkus.map((sku) => sku.id);
        // 判断哪些sku需要修改，获取skuid
        const incomingIds = dto.skus
          .filter((sku) => sku.id)
          .map((sku) => sku.id as string);
        // 需要删除的sku
        const deleteIds = dbIds.filter((id) => !incomingIds.includes(id));
        if (deleteIds.length > 0) {
          await manager.delete(ProductSku, { id: In(deleteIds) });
        }
        // 更新sku，save支持有id修改，无id新增
        const saveEntities = dto.skus.map((sku) =>
          manager.create(ProductSku, {
            ...sku,
            product_id: id,
          }),
        );
        if (saveEntities.length > 0) {
          await manager.save(saveEntities);
        }
        return '修改成功';
      }
      return '修改成功';
    });
  }

  // 删除产品
  async delProduct(id: string) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('产品不存在');
    return this.dataSource.transaction(async (manager) => {
      // 删除 Product SKU
      await manager.delete(ProductSku, { product_id: id });
      // 删除 Product
      await manager.delete(Product, id);
      return '删除成功';
    });
  }
}
