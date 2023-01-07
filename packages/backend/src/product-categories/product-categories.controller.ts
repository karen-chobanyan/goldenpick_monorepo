import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/user.decorator';
import { FilesService } from 'src/files/files.service';
import { ProductCategoriesService } from './product-categories.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';

@Controller('categories')
export class ProductCategoriesController {
  constructor(
    private readonly productCategoriesService: ProductCategoriesService,
    private readonly filesService: FilesService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() data: CreateProductCategoryDto, @CurrentUser() user) {
    let category;
    if (!data._id) {
      const imgs: [{ url?: string; }?] = data.images.length
        ? await this.filesService.upload(data.images, user)
        : [];

      data.images = imgs;
      data.owner = !user.owner ? user._id : user.owner;

      category = await this.productCategoriesService.create(data);
    } else {
      const imgs = await this.filesService.upload(data.images, user);
      if (imgs.length) {
        data.images = imgs;
      }
      category = this.productCategoriesService.update(data);
    }
    return category;
  }

  @Get()
  findAll() {
    return this.productCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productCategoriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductCategoryDto: CreateProductCategoryDto,
  ) {
    return this.productCategoriesService.update(updateProductCategoryDto);
  }

  @Post('delete')
  @UseGuards(AuthGuard('jwt'))
  async deleteContact(@Body() data, @CurrentUser() user) {
    const cat = await this.productCategoriesService.delete(data);
    return cat;
  }
}
