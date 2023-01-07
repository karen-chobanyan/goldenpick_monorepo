import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID } from 'bson';
import { Repository } from 'typeorm';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { ProductCategory } from './product-category.entity';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly repository: Repository<ProductCategory>,
  ) {}

  async create(data): Promise<ProductCategory> {
    return this.repository.save(data);
  }

  async findAll() {
    return this.repository.find();
  }

  findOne(_id: string) {
    return this.repository.findOne(_id);
  }

  update(data: CreateProductCategoryDto) {
    return this.repository.save({
      ...data,
      _id: new ObjectID(data._id),
    });
  }

  remove(id: number) {
    return `This action removes a #${id} productCategory`;
  }
  async delete(product_category): Promise<any> {
    return this.repository.delete({ _id: new ObjectID(product_category._id) });
  }
}
