import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/product.entity';
import { FilesService } from 'src/files/files.service';
import { PublicFile } from 'src/files/publicFile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, PublicFile])],
  providers: [ProductsService, FilesService],
  controllers: [ProductsController],
})
export class ProductsModule {}
