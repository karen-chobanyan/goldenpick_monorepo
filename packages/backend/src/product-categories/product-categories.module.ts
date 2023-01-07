import { Module } from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import { ProductCategoriesController } from './product-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory } from './product-category.entity';
import { FilesService } from 'src/files/files.service';
import { PublicFile } from 'src/files/publicFile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductCategory]),
    TypeOrmModule.forFeature([PublicFile]),
  ],
  controllers: [ProductCategoriesController],
  providers: [ProductCategoriesService, FilesService],
})
export class ProductCategoriesModule {}
