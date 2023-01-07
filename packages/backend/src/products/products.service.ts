import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID } from 'bson';
import { Product } from 'src/products/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async get(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async create(data: Product): Promise<Product> {
    return this.productRepository.save(data);
  }

  async update(productData: Product): Promise<Product> {
    return this.productRepository.save({
      ...productData,
      _id: new ObjectID(productData._id),
    });
  }

  async getProduct(_id): Promise<Product> {
    return this.productRepository.findOne(_id);
  }

  async delete(product): Promise<any> {
    return this.productRepository.delete({ _id: new ObjectID(product._id) });
  }
}
